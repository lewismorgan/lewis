# lewis

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/lewismorgan/lewis/ci.yml)
![GitHub deployments](https://img.shields.io/github/deployments/lewismorgan/lewis/Production?logo=vercel&label=Vercel&link=https%3A%2F%2Flewismorgan.dev)

Personal landing page for me made using NextJS, TailwindCSS, and deployed using Vercel.

- Displays some info about myself and shows some data from my GitHub repositories.
- Optimized mobile-first with a friendly experience on desktop.

## Installation

Before starting, make sure to create a .env file and specify a `GITHUB_TOKEN` variable with a GitHub token that has access to the repositories and user scopes. See `.env.example` for an example.

```bash
git clone https://github.com/lewismorgan/lewis.git
pnpm install
pnpm dev
```

### VSCode

If using VSCode then you can do the following:

```bash
git clone https://github.com/lewismorgan/lewis.git
code .
```

When VSCode launches, click on "Open in devcontainer" using the VSCode Development Containers extension.
The pacakges will automatically be installed using corepack and pnpm. Corepack installs the package manager defined in `package.json`.

If not, perform the following:

```bash
corepack install
pnpm install
```

Visit the deployed website using your web browser

## Structure

- `src/app` - Pages that are rendered by NextJS
  - `api` - API requests if data is needed to be called clientside
    - Not used in this project as all data components are fetched and rendered serverside
- `src/components` - Reusable components used throughout the site
  - `client` - Components that can only be rendered on the client side, such as the hero interactivity
  - `server` - Components that can only be rendered on the server side, such as the cards displayed with git information
  - `ui` - Client only components that are used from shadcn library
  - `utils` - Utility components such as theme provider and icons
- `src/lib` - Library of common type definitions between server and client, as well as some utility functions
- `src/server` - Server side functions that are used to fetch my personal data from the GitHub API and can be called from either the /api route or the React Server Components
- `src/styles` - TailwindCSS configuration (single globals.css file setup for shadcn)
- `public` - Static assets

## CI/CD

The project also makes use of GitHub Actions to report any lint, type or build time errors. As such, the site is automatically deployed to Vercel on push to the main branch, handled outside the `ci` action through a direct connection with Vercel using GitHub Deployment Environments. Each commit will display status badges of the `ci` action, and the deployment status of the site from Vercel.

## License

MIT License
