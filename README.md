# pagepilot-vanilla-vue-app

This workspace contains a minimal Vue 3 application scaffolded with Vite.

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Run the dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

Deploy to GitHub Pages
---------------------

1. The project is configured to deploy to GitHub Pages under the `gh-pages` branch. The Vite `base` is set for the repository name.

2. To deploy manually from your machine:

```bash
npm install
npm run deploy
```

3. CI: a GitHub Actions workflow is included at `.github/workflows/deploy.yml` which will automatically build and publish `dist` to GitHub Pages on pushes to `main`.

