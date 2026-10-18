# SAVER website

Static GitHub Pages website for SAVER Verifier. Production: https://saververify.com.

`index.html`, `styles.css` and `app.js` provide the presentation. `llms.txt`, `openapi.json`, `agent-tool.json` and `.well-known/x402` expose real machine-readable integration metadata on the main domain. Paid calls always go to the canonical https://api.saververify.com API.

`examples.json` and `examples/index.html` publish actual paid result records only. An empty collection must remain explicitly empty; never fabricate results or present offline fixtures as paid examples. Identify operator-funded purchases and retain original outputs and transaction references. Do not count them as organic customers.

The published ClawHub skill is v1.1.0. Its exact-version security status was checked as clean on 2026-10-18; this is a skill scan, not an API accuracy audit or an audit of future revisions.

Preview with `python -m http.server 8080`. No build step or runtime credentials are required. Keep the OpenAPI and tool-definition copies synchronized with the canonical API contract. Never place environment files or server implementation in this repository.

## Three current paid examples

`examples.json` contains exactly three new, source-guided paid records: energy capacity, electric-car sales/stock and Internet use by income group. `examples/` serves the three original JSON records and the report page. The five earlier records and the archive section have been removed from the public site; historical captures remain in the private operational record and Git history. Do not overwrite them to pretend a past response changed.

The hero and OpenAPI response example use the first new record. Main figures, reporting periods and source linkage were checked against the publications, and all three 0.20 USDC transfers were verified on Base. Returned outputs are unchanged. These demonstrations are not organic purchases or an independent accuracy benchmark.
