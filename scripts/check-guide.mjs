import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const text=path=>readFile(new URL(path,root),'utf8');
const [html,workflow,tool,manifest,examples,sitemap,llms]=await Promise.all([
 text('fact-checking-api/index.html'),text('fact-checking-api/agent-workflow.md'),
 text('agent-tool.json').then(JSON.parse),text('x402-manifest.json').then(JSON.parse),text('examples.json').then(JSON.parse),text('sitemap.xml'),text('llms.txt'),
]);
const url='https://saververify.com/fact-checking-api/';
assert.ok(html.includes('rel="canonical" href="'+url+'"'));
assert.equal((html.match(/<h1>/g)||[]).length,1);
assert.equal(tool.selectionGuide.buyerGuide,url);
assert.equal(tool.selectionGuide.agentWorkflow,url+'agent-workflow.md');
assert.ok(sitemap.includes('<loc>'+url+'</loc>'));
assert.ok(llms.includes(url+'agent-workflow.md'));
assert.equal(examples.examples.length,3);
for(const record of examples.examples) assert.ok(html.includes('/examples/#'+record.id));
const decode=value=>value.replaceAll('&#x27;',"'").replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const request=JSON.parse(decode(html.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/)[1]).split('\n\n')[1]);
assert.deepEqual(request,examples.examples.find(x=>x.id==='energy-capacity-check').request,'displayed request must be an original paid record');
const terms=manifest.resources[0].accepts[0];
for(const value of [terms.amount,terms.asset,terms.payTo,terms.network,(Number(terms.amount)/1e6).toFixed(2)]) assert.ok(workflow.includes(value),'workflow payment terms drift');
assert.ok(workflow.includes('does not authorize payment'));
for(const match of html.matchAll(/href="([^"]+)"/g)) {
 const value=match[1];if(value.startsWith('https:')) continue;
 if(value.startsWith('#')) {assert.ok(html.includes('id="'+value.slice(1)+'"'));continue;}
 const path=new URL(value,url).pathname;
 await access(new URL(path.slice(1)+(path.endsWith('/')?'index.html':''),root));
}
console.log('Guide links, sitemap, original paid request, three records and bounded payment terms are consistent. No network or payment.');
