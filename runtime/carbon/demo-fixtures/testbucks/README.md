# TestBucks — CARBON's bundled demo app

A complete fictional coffee-shop training app: searchable menu, drink customization,
cart quantities, discounts and tax, simulated checkout success/decline/timeout,
order history, cancellation, persistence, and practice exercises.

Run `node server.mjs` in this disposable copy. Open the exact loopback URL printed
by the server; its port is allocated automatically. No npm install, API key,
model service, payment service, account, or Internet connection is required.
Use the coding agent's available built-in browser to test the app. Do not install
Selenium or Playwright just to run this demo. Stop the server after testing unless
the user asks to keep the demo open.

Use synthetic data only. Checkout, cancellation, and refunds are local simulations;
they never create real orders or move money. The app stores practice data in browser
local storage. A new server port separates it from earlier runs. The optional tests
folder is only a starting inventory, not evidence that checks passed.

Read the visible Practice page for product rules. Exercise the app to establish
results: do not assume it contains bugs or treat a seeded-issue list as findings.
CARBON must generate its normal branded HTML report, evidence, confidence assessment,
coverage gaps, and useful next steps after the demo.

Source: Jason Arbon's TestBucks course app, `courses/how-ai-tests-software/Testbox.html`
and original `testbucks-cup.png`, bundled snapshot October 10, 2026. The application
is included intact; the local static server is CARBON-specific. Fictional training
brand, not affiliated with Starbucks. No Jev runner, credentials, recordings, or
course manuscripts are bundled.
