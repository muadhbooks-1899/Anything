# Anything — multi-page website

A responsive, modern-minimal static website built with HTML, CSS, and vanilla JavaScript.

## Pages
- `index.html` — Home
- `about.html` — About
- `privacy.html` — Privacy policy
- `terms.html` — Terms & conditions
- `contact.html` — Contact form (powered by Netlify Forms)
- `thank-you.html` — Shown after the contact form is sent
- `404.html` — Custom not-found page

## Preview locally
Open `index.html` in your browser, or run a local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Before publishing
- The contact form is front-end only. Connect it to a form service or backend to receive messages.
- Privacy policy and terms are starter templates, not legal advice. Update them to match your real data practices and business details.
- The font uses Google Fonts; local/system fallbacks are included.
- `404.html` is not linked in the normal navigation or footer.
- Hosting configuration included: `_redirects` for Netlify and `.htaccess` for Apache. For other hosts, configure their custom 404/not-found setting to serve `404.html`.
- If you use a platform with its own routing rules, verify its configuration before deploying.
