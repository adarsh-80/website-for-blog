# The Living Book

A static, deploy-ready personal reading website. No backend is required.

## Structure

- `index.html` — landing page + Topics interface
- `site-data.js` — the dynamic content registry for versions, webpages and topics
- `script.js` — Topics UI and reading-page navigation behavior
- `style.css` — shared styling
- `about.html` — About page
- `pages/` — individual webpages

## Add a future webpage

1. Put the new HTML file inside `pages/`.
2. Add a page object to the correct version in `site-data.js`.
3. Add its topic IDs and titles to that page's `topics` array.
4. Make sure the HTML section IDs match those topic IDs.

No other page needs to be rebuilt.

## Deploy

Push the folder to GitHub and import the repository into Vercel. Vercel can serve this as a static site.
