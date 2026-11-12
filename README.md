# SFI Engineering — Sight Flow Indicators

Website for SFI Engineering's Sight Flow Indicators (Rotor, Flapper, Full View, Drip Tube), with scroll-driven 3D product stories, spec tables, a configurator and a quotation request form.

## Run it on your computer

### 1. Install Node.js

You need **Node.js 22** (20.19 or newer also works). Check what you have:

```sh
node -v
```

If it's missing or older, download the LTS version from https://nodejs.org, or with [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install   # reads .nvmrc
nvm use
```

### 2. Get the code

Clone the repository (or download the codebase ZIP from Lovable and unzip it), then open a terminal in the project folder:

```sh
git clone <this-repository-url>
cd <repository-name>
```

### 3. Install and start

```sh
npm install
npm run dev
```

Open **http://localhost:8080** in your browser. If port 8080 is busy, the terminal shows the address it picked instead. Changes you save to files under `src/` appear in the browser automatically.

Prefer [Bun](https://bun.sh)? `bun install` then `bun run dev` works too.

No environment variables or API keys are needed.

## Other commands

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Start the local development server             |
| `npm run build`   | Build the production version into `.output/`   |
| `npm run preview` | Serve the production build locally             |
| `npm test`        | Run the tests                                  |
| `npm run lint`    | Check the code for problems                    |

## Troubleshooting

- **`npm install` fails with "Cannot read properties of null (reading 'edgesOut')"** — make sure the `.npmrc` file from this repository is in the project folder (it may be hidden; it contains `legacy-peer-deps=true`).
- **Errors about unsupported Node version / syntax errors on start** — upgrade Node.js to 22 (step 1).
- **Install got into a bad state** — delete the `node_modules` folder (and `package-lock.json` if one was created) and run `npm install` again.
- **3D models don't show** — your browser or graphics driver may have WebGL disabled, or your system has "reduce motion" turned on; the site then shows still product photos instead.

## Project structure

- `src/routes/` — one file per page (home, products, engineering, applications, technical resources, contact)
- `src/components/` — site menu/footer, product page sections, and the 3D scenes (`three/`)
- `src/lib/products.ts`, `src/lib/specs.ts` — product wording and specification options
- `src/assets/` — product photos

This project was built with [Lovable](https://lovable.dev/projects/040d5953-3d06-47ce-9adb-b7c05f533c38). Changes pushed to the main branch on GitHub sync back into Lovable.
