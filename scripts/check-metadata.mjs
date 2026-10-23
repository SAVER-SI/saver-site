import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = async name => JSON.parse(await readFile(new URL(name, root), 'utf8'));
const [api, tool, manifest, discovery, alias] = await Promise.all([
  read('openapi.json'), read('agent-tool.json'), read('x402-manifest.json'),
  read('.well-known/x402'), read('.well-known/x402.json'),
]);
const description = api.info.description;
assert.equal(typeof description, 'string');
assert.ok(description.length > 0 && description.length <= 500);
assert.equal(tool.description, description, 'tool description drift');
assert.equal(manifest.description, description, 'manifest description drift');
assert.equal(discovery.service.description, description, 'well-known description drift');
assert.deepEqual(alias, discovery, 'well-known aliases differ');
assert.equal(tool.transport.method, 'POST');
assert.equal(tool.transport.url, 'https://api.saververify.com/v2/verify');
assert.equal(manifest.recommendedEndpoint, tool.transport.url);
assert.equal(discovery.recommendedEndpoint, tool.transport.url);
const urls = ['https://api.saververify.com/v2/verify', 'https://api.saververify.com/verify'];
assert.deepEqual(manifest.resources.map(x => x.url).sort(), [...urls].sort());
assert.deepEqual(discovery.resources.map(x => x.url).sort(), [...urls].sort());
for (const resource of manifest.resources) {
  assert.equal(resource.method, 'POST');
  assert.equal(resource.description, description);
  assert.ok(resource.tags.length <= 5, 'x402 ResourceInfo tag limit exceeded');
  assert.equal(resource.extensions.bazaar.info.input.method, 'POST');
  const terms = resource.accepts[0];
  assert.equal(terms.amount, '200000');
  assert.equal(terms.network, 'eip155:8453');
  assert.equal(terms.payTo.toLowerCase(), '0xdfd6cb683f5288e1dd1337e84c09b490857cc110');
  assert.equal(terms.asset.toLowerCase(), '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913');
}
console.log('Static descriptions, routes, x402 tags and payment terms are consistent. No network or payment performed.');

const html = await readFile(new URL('index.html', root), 'utf8');
const structuredBlock = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(structuredBlock, 'missing WebAPI structured data');
const structured = JSON.parse(structuredBlock[1]);
assert.equal(structured['@type'], 'WebAPI');
assert.equal(structured.description, description, 'structured description drift');
assert.equal(structured.url, tool.transport.url);
assert.equal(structured.mainEntityOfPage, 'https://saververify.com/');
console.log('WebAPI structured data matches the canonical description and endpoint.');
