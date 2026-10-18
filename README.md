# SAVER website

Static GitHub Pages website for SAVER Verifier. Production: https://saververify.com.

`index.html`, `styles.css` and `app.js` provide the presentation. `llms.txt`, `openapi.json`, `agent-tool.json` and `.well-known/x402` expose real machine-readable integration metadata on the main domain. Paid calls always go to the canonical https://api.saververify.com API.

`examples.json` and `examples/index.html` publish actual paid result records only. An empty collection must remain explicitly empty; never fabricate results or present offline fixtures as paid examples. Identify operator-funded purchases and retain original outputs and transaction references. Do not count them as organic customers.

The published ClawHub audit references v1.0.3 only; it is not an API accuracy audit or an audit of newer skill source revisions.

Preview with `python -m http.server 8080`. No build step or runtime credentials are required. Keep the OpenAPI and tool-definition copies synchronized with the canonical API contract. Never place environment files or server implementation in this repository.
