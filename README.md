# Vite & Angular — remote microfrontend template

Starter template for the [MFE Orchestrator](https://github.com/mfe-orchestrator), listed in the
marketplace as `vite-remote-angular`. Vite + Angular 22, wired as a **remote**.

## Requirements

- Node.js 22.22.3, 24.15 or newer (what Angular 22 supports)
- [pnpm](https://pnpm.io) 12 (pinned in `packageManager`; `corepack enable` picks it up)

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # production build into dist/
```

## Project structure

```
.
├── .github/workflows/build-and-deploy.yml   # build + upload to the orchestrator
├── index.html                               # standalone dev page
├── src/
│   ├── app/
│   │   ├── app.component.ts                 # dev only shell
│   │   └── button.component.ts              # the exposed component
│   └── main.ts
├── package.json
├── pnpm-workspace.yaml                      # pnpm build script approvals
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts                           # federation config
```

## What this remote exposes

| module | source |
| --- | --- |
| `./Button` | `src/app/button.component.ts` |

Federation name `remote_app`, entry file `dist/assets/remoteEntry.js`.

Add more in the `exposes` map of `vite.config.ts`. Anything you expose there becomes importable from a
host as `<remote-name>/<key>`.

A host does not hardcode this remote's URL: it asks the orchestrator for it by slug. See the host
templates for the other side of the wiring.

## Build output

`pnpm build` writes to `dist/`. The federation entry lands at **`dist/assets/remoteEntry.js`**, which is the `entryPoint` the marketplace entry declares.

Check it after any change to `vite.config.ts`: the orchestrator serves exactly that path, so a build that
puts the entry somewhere else is broken.

## Deploying

### Upload to the orchestrator

`.github/workflows/build-and-deploy.yml` builds the app and uploads `dist/` with
[`mfe-orchestrator/github-action`](https://github.com/mfe-orchestrator/github-action). It runs on
any pushed tag, or manually via *Run workflow*.

Configure these once, in the repository settings:

| kind | name | value |
| --- | --- | --- |
| secret | `MICROFRONTEND_ORCHESTRATOR_API_KEY` | your orchestrator API key |
| variable | `MICROFRONTEND_SLUG` | the slug of this remote in the orchestrator |
| variable | `MICROFRONTEND_ORCHESTRATOR_DOMAIN` | your console URL, optional, defaults to `https://console.mfe-orchestrator.dev` |

The API key is a **secret**, never a variable and never a literal in the workflow file. If you
prefer hardcoding the two per project values instead of using repository variables, replace the
expressions in the `env:` block at the top of the workflow.

## Notes

- Angular is compiled ahead of time by [`@analogjs/vite-plugin-angular`](https://npmjs.com/package/@analogjs/vite-plugin-angular). `@angular/build` is a required dev dependency of that plugin, even though nothing here uses the Angular CLI.
- Change detection is zoneless, so `zone.js` is never loaded. Drop `provideZonelessChangeDetection()` from `src/main.ts` and add `import 'zone.js'` if you want the zone based scheduler back.
- `ngDevMode` is defined as `false` in `vite.config.ts`, the way the Angular CLI does in a production build. Without it Angular's development assertions end up in the bundle.

## License

MIT
