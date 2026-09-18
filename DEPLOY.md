# Deploy Eagles Gym to Vercel

Extract this ZIP first. The `eagles-gym-vercel` folder is the project root: it contains `package.json`, `vercel.json` and `index.html`.

## Option 1 — Git import

1. Put the contents of `eagles-gym-vercel` in a Git repository and push it to your Git provider.
2. In Vercel, add a new project and import that repository.
3. Set Root Directory to the directory containing `vercel.json`. If you uploaded the containing folder too, select `eagles-gym-vercel`.
4. Use Framework Preset **Other**. The included configuration sets Build Command to `npm run build` and Output Directory to `dist`.
5. Click Deploy. No environment variables or third-party runtime dependencies are needed.

## Option 2 — Vercel CLI

From inside `eagles-gym-vercel`, with Node.js and npm installed:

```sh
npm run build
npx vercel
```

Follow the prompts to connect your Vercel account and project. Review the preview deployment, then publish with:

```sh
npx vercel --prod
```

Do not upload the ZIP itself as source code. Extract it first.

## Package details

- Static HTML, CSS and JavaScript; no framework migration needed.
- Fonts, logos, photographs and animation libraries are bundled.
- A build copies only the site and assets into `dist`; documentation and build scripts are not published.
- Every button uses the same 12px radius, with visible keyboard focus and 44px minimum tap targets.
- Existing animations, timetable filters, calculator, official logos and membership preview are retained.
- The contact form opens the visitor's email application. It does not submit to a backend.
- Signup links continue to the client's existing Eagles Gym signup website.

Configuration reference: https://vercel.com/docs/project-configuration

This package is ready to deploy; it has not been deployed to your Vercel account.
