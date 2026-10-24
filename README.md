# SAVER Verifier website

Static GitHub Pages website at https://saververify.com. Verify factual claims and check whether cited sources support them. Fact-check statistics, dates and source attributions in agent research and reports.

## Repository boundaries

- This repository contains the premium presentation and public discovery assets.
- [SAVER-SI/saver-verifier](https://github.com/SAVER-SI/saver-verifier) contains public API documentation, client examples and the skill.
- The private `SAVER-SI/agent` repository contains production server and business logic. Do not copy private implementation, environment files or credentials here.

Paid requests go to `POST https://api.saververify.com/v2/verify`; the original `/verify` format remains supported. Price is 0.20 USDC through x402 v2 on Base. API contract 1.2.2 and skill 1.1.1 are separate versions.

## Presentation and machine contracts

`index.html`, `styles.css` and `app.js` provide the presentation. Keep it focused; new operational detail belongs in the API documentation.

Keep the shared service description synchronized across `agent-tool.json`, `openapi.json`, `x402-manifest.json`, `.well-known/x402` and `.well-known/x402.json`, and aligned with API discovery. Host-specific documentation links may differ. Static recovery metadata points to live API discovery for the actual `resultRecovery.durable` value; do not hard-code restart durability into a static site.

The manifest preserves POST methods, JSON input/output schemas and examples. Its five resource tags must stay within the x402 ResourceInfo limit. `.well-known/agent-tools.txt`, `llms.txt`, robots and sitemap support free inspection; they do not perform verification or authorize payment.

## Three actual paid examples

`examples.json`, the three `examples/*.json` records and `examples/index.html` publish the unchanged source-guided paid reports for energy capacity, EV sales/fleet and Internet-use populations. Preserve original requests, responses and transaction references. Label them operator-funded; they are not organic customer purchases or an independent accuracy benchmark. Reading them is free and does not run a model or payment.

Do not replace actual results with fixtures, add an unreviewed fourth example or describe an entire report as verified from a single checked claim. Confidence remains model-assessed.

## Publishing and checks

GitHub Pages publishes the repository after a push. The offline `Static metadata checks` workflow compares descriptions, aliases, routes, tags and payment terms without network requests, secrets or payments. Run it locally with `node scripts/check-metadata.mjs`. Verify the Pages workflow, homepage, example collection and both discovery aliases after changes. Compare shared schemas and descriptions with the canonical API. A production payment is not required for static documentation changes.

The HTML presentation and example records were not changed in this cleanup. See [CHANGELOG.md](CHANGELOG.md) and Git history for dated changes rather than treating historic test counts as current status.

## Search indexing

The homepage publishes Schema.org WebAPI JSON-LD with the canonical service description and POST endpoint. The offline metadata check verifies that it stays synchronized. The sitemap records actual homepage modification dates; search engines determine crawl timing and ranking. Do not add self-assigned review scores or treat operator tests as customer adoption.



## Agent research-report entry point

`/fact-checking-api/` explains the existing single-claim research workflow and links to the same three original paid reports. Its plain-text agent workflow is `/fact-checking-api/agent-workflow.md`. The homepage adds one footer link; existing paid examples, price and API transport are unchanged. `agent-tool.json`, `llms.txt` and the sitemap connect the guide to machine discovery.

After successful main-branch metadata checks, the IndexNow workflow waits until the changed public documents match their published contents, verifies the ownership file, and sends those URLs to the global IndexNow endpoint. It uses no wallet, model, paid service or account secret. The ownership token is separate from every wallet/API credential. A failed notification does not fail the site deployment; inspect the notification step and summary for its actual HTTP status. Acceptance is not a guarantee of indexing, search rank or sales. The automatic change filter compares the deployed commit with its first parent; use `node scripts/notify-indexnow.mjs --execute` for an intentional full resubmission after reviewing the URL list. Without `--execute`, the script is a network-free dry run.

Checks: `node scripts/check-metadata.mjs`, `node scripts/check-guide.mjs`, `node --test scripts/indexnow.test.mjs`. GitHub CI also renders desktop/mobile layouts with the standard runner's preinstalled ChromeDriver, checks viewport width and overflow, and emits preview images in the job log. It adds no npm dependencies or artifact storage.

Catalogue display label: **SAVER Verifier Fact Checking**. Canonical routes, response versions and payment terms are documented in the manifest.
