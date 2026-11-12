<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Shared site chrome (Nav, Footer, web fonts) lives in `src/routes/__root.tsx` around `<Outlet />`; pages render only their own sections.
- 3D scenes (`src/components/three/*`) are lazy-loaded behind `useCapabilities()` with a static image fallback for reduced motion / no WebGL, because three.js cannot run during SSR.
- Product content and spec option lists live in `src/lib/products.ts` and `src/lib/specs.ts`; unknown manufacturer dimensions display "on request" rather than invented numbers.
- Keep `.npmrc` with `legacy-peer-deps=true` and `engines.node` in package.json: plain `npm install` otherwise crashes on the vitest/vite 8 peer set, and vite 8 needs Node 20.19+.
