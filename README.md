# SAVER website

Static GitHub Pages website for SAVER Verifier. Production: https://saververify.com.

`index.html`, `styles.css` and `app.js` provide the presentation. `llms.txt`, `openapi.json`, `agent-tool.json` and `.well-known/x402` expose real machine-readable integration metadata on the main domain. Paid calls always go to the canonical https://api.saververify.com API.

`examples.json` and `examples/index.html` publish actual paid result records only. An empty collection must remain explicitly empty; never fabricate results or present offline fixtures as paid examples. Identify operator-funded purchases and retain original outputs and transaction references. Do not count them as organic customers.

The published ClawHub skill is v1.1.1. The operator's exact-version CLI output confirms latest 1.1.1, security status clean and no warnings on 2026-10-19; this is a skill scan, not an API accuracy audit or an audit of future revisions.

Preview with `python -m http.server 8080`. No build step or runtime credentials are required. Keep the OpenAPI and tool-definition copies synchronized with the canonical API contract. Never place environment files or server implementation in this repository.

## Three current paid examples

`examples.json` contains exactly three new, source-guided paid records: energy capacity, electric-car sales/stock and Internet use by income group. `examples/` serves the three original JSON records and the report page. The five earlier records and the archive section have been removed from the public site; historical captures remain in the private operational record and Git history. Do not overwrite them to pretend a past response changed.

The hero and OpenAPI response example use the first new record. Main figures, reporting periods and source linkage were checked against the publications, and all three 0.20 USDC transfers were verified on Base. Returned outputs are unchanged. These demonstrations are not organic purchases or an independent accuracy benchmark.


## Maintenance contract 1.2.1

Both static x402 discovery aliases now recommend the canonical v2 endpoint and refer to canonical API discovery for current recovery durability. OpenAPI copies document null context and service failures for unfinished research. Recovery files expire after 24 hours and are swept periodically in the existing API process. The three public paid examples are unchanged. No new runtime service or subscription is introduced.


## Maintenance contract 1.2.2

OpenAPI and the flat tool definition match API release 1.2.2, including null context and invalid-provider-response failures before settlement. SECURITY.md in the public documentation repo is the HTTPS contact referenced by security.txt. It explains how to arrange private security reporting without publishing a private mailbox or pretending that a support mailbox exists. Three public paid records remain unchanged.

## Buyer-facing descriptions

The website and discovery metadata describe the same existing claim-verification service: figures, dates and source attributions checked before use in research, reports or decisions. Three stored operator-funded reports provide free inspection of actual paid outputs; they are not customer reviews or an independent accuracy benchmark. Price remains 0.20 USDC per completed verification. No new verification features, research calls or payment permissions are introduced by this wording update.

## Presentation refinement — 23 October 2026

Keep the existing page structure and three paid examples. The hero explains the capacity-versus-generation finding, report cards link to readable case anchors, and the integration card shows the full POST endpoint above the unchanged request/response examples. ClawHub labels describe a skill scan rather than a full code audit. Small-text contrast, keyboard focus and fixed-header anchor spacing are improved. No paid JSON, API contract, prices, model settings or payment behavior changes.
