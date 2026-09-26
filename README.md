# TaskFlow

A lightweight task manager built with plain HTML, CSS and JavaScript — no frameworks, no build step. Add tasks, set a priority, filter by status, and everything is saved to the browser automatically.

**Live demo:** _add your GitHub Pages link here once deployed_

## Features

- Add tasks with a priority level (Low / Medium / High)
- Mark tasks complete, delete them, or double-click to edit the text
- Filter by All / Active / Completed
- Live "items left" counter and a one-click "Clear completed"
- Data persists in the browser via `localStorage` — no backend, no sign-in
- Responsive layout, keyboard-accessible, respects reduced-motion preferences

## Tech stack

- HTML5
- CSS3 (custom properties, flexbox, no framework)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` API

## Running it locally

No build tools needed. Either:

1. Open `index.html` directly in a browser, or
2. Serve the folder with any static server, e.g. the VS Code "Live Server" extension.

## Deploying

This is a static site, so it works as-is on GitHub Pages:

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set the source branch to `main` (root).
4. Your app will be live at `https://<username>.github.io/<repo-name>/`.

## Project structure

```
taskflow/
├── index.html
├── style.css
├── script.js
└── README.md
```
