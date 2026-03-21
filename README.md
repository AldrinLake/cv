# CV – Aldrin Lake

A clean, responsive single-page CV built with plain HTML, CSS and JavaScript.

## Live site

Enable **GitHub Pages** (`Settings → Pages → Deploy from branch: main, / (root)`) and the CV will be served at:

```
https://aldrinlake.github.io/cv/
```

## Files

| File | Purpose |
|---|---|
| `index.html` | CV page shell and language switch |
| `style.css` | Styles (responsive two-column layout) |
| `script.js` | Renders CV sections from JSON and handles language switching |
| `cv-data.json` | Configurable CV content for Chinese and English |

## Customising

Edit `cv-data.json` to update CV content and both language versions.  
Set both `left.avatar.type` to `image` and `left.avatar.url` (e.g. `avatar.svg`) in `cv-data.json` to use an image avatar, and keep `left.avatar.text` as fallback initials if the image is unavailable.  
Edit `style.css` to change colours or layout.
