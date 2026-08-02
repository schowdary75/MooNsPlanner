# moons-plugin-sdk

The SDK for building [MooNs](https://github.com/schowdary75/MooNsPlanner) plugins.

The path is four commands: **`create` → `dev` → `status` → `publish`**. Everything
else the CLI can do is a step one of those already does for you.

## Scaffold a plugin

```bash
npx moons-plugin-sdk                        # no command? a guided menu of everything below
npx moons-plugin-sdk create                 # interactive wizard (id, type, icon, permissions, egress)
npx moons-plugin-sdk create my-plugin --type widget   # or non-interactive
cd my-plugin
```

The wizard asks for the id, type, icon (validated against lucide), permissions,
egress hosts and required addons, and offers to initialize a git repo and install
dependencies for you. In a non-interactive shell (CI, pipes) every command stays
flag-driven with plain output — no prompts, and machine output (`entry` JSON,
`pack --json`, PR URLs) stays on stdout.

What you get **runs and packs immediately** — but it is not publishable yet: the
README is a template and there is no screenshot. That is deliberate. Writing those
is your job, and `status` tells you exactly what is left.

## Develop with a live reload loop

`dev` runs your plugin locally — no full MooNs needed. It injects a `ctx` that
enforces exactly the permissions your manifest grants (an ungranted call throws
`PERMISSION_DENIED`, so you catch missing grants), backs `db:own` with a real
SQLite file, serves your routes and your page/widget UI, and reloads on save.

```bash
npx moons-plugin-sdk dev        # http://localhost:4317 — dashboard, routes, UI
```

Open **`/preview`** to see a page/widget rendered in a real sandboxed frame with a
theme/accent/appearance toggle (`MooNs.invoke()` is proxied to your routes). Hit a route
as an unauthenticated request with `?_anon=1`. Drop a `dev-fixtures.json` (trips, users,
config) next to your manifest to feed `ctx.trips` / `ctx.users`.

## Know where you are

```bash
npx moons-plugin-sdk status        # never fails — it's a map, not a gate
```

`status` runs every check the MooNs-Plugins registry enforces that can be answered
without a network — which is nearly all of them — and prints the whole journey as a
checklist grouped by stage (Manifest, Code, Docs, Release, Repo): what passes, what
does not, and the **one** command to run next. Run it whenever you are not sure what
to do; it deliberately never exits non-zero.

`validate` is the same checks with an exit code. It is the form for scripts and CI;
`status` is the form for humans. A plugin that passes `validate` will pass every
registry gate that does not require the tag and the release to exist — those four
run in `preflight`, which `publish` does for you.

## Build a native UI (page / widget)

The UI is a sandboxed, opaque-origin iframe that can't load MooNs's stylesheet — so the
SDK ships it. Put **one line** in your `client/index.html` `<head>`:

```html
<!-- MooNs:ui -->
```

`dev` and `pack` expand it into the inlined **design kit**: token-driven styles that
follow the host's theme and accent (glass, cards, `.MooNs-btn`, `.MooNs-input`,
`.MooNs-chip`, `.MooNs-row`, hover), plus a `window.MooNs` bridge:

```js
MooNs.onContext((ctx) => { /* ctx.theme, ctx.tokens, ctx.appearance, ctx.user, ctx.tripId */ })
const data = await MooNs.invoke('/status')   // calls your own route, host-proxied
MooNs.notify('success', 'Saved')
```

The kit applies the theme, mirrors the appearance flags (reduced-motion,
no-transparency) and auto-reports your height. It also upgrades any native
`<select>` into a host-styled, keyboard-accessible dropdown that matches MooNs —
the OS-drawn popup never could. Write a plain `<select>` and it just works; add
`data-MooNs-native` to opt a field out. See the
[Plugin Development wiki](https://github.com/schowdary75/MooNsPlanner/wiki/Plugin-Development)
for the full component + token reference.

## Write a plugin

```js
const { definePlugin } = require('moons-plugin-sdk')

module.exports = definePlugin({
  async onLoad(ctx) {
    await ctx.db.migrate('001', 'CREATE TABLE cache (k TEXT PRIMARY KEY, v TEXT)')
  },
  routes: [
    { method: 'GET', path: '/status', auth: true, async handler(req, ctx) {
      return { status: 200, headers: { 'content-type': 'application/json' }, body: '{"ok":true}' }
    }},
  ],
})
```

Your plugin runs in an **isolated child process**. `ctx` is the only way to reach
MooNs, and it grants exactly the permissions your `MooNs-plugin.json` declares — an
ungranted call throws `PERMISSION_DENIED`.

## Test without a running MooNs

```js
import { createMockHost } from 'moons-plugin-sdk/testing'

const { ctx, broadcasts } = createMockHost({
  grants: ['db:read:trips', 'ws:broadcast:trip'],
  trips: { 1: { members: [42], data: { id: 1, name: 'Japan' } } },
})
// the mock enforces the SAME permission model, so you can prove your plugin
// degrades gracefully when a permission is missing.
```

## Capture the screenshot

The registry requires a screenshot that resolves to a real image, and the store card
shows it. `shot` boots the dev server, renders your plugin in the same themed frame
MooNs uses, and writes a 1600×900 `docs/screenshot.png`:

```bash
npm i -D playwright && npx playwright install chromium   # once
npx moons-plugin-sdk shot                                 # --dark for the dark theme
```

Playwright is deliberately **not** a dependency of this SDK — it ships a browser, and
most authors never need one. An `integration` plugin has no UI to render, so `shot`
cannot help; screenshot the MooNs surface your plugin changes instead.

## Publish — one command

Commit and push your plugin to its public GitHub repo, then:

```bash
npx moons-plugin-sdk publish --repo you/repo --tag v1.0.0
```

`publish` is the whole release, in five steps and in this order:

1. **check** — every registry gate that can be checked locally
2. **pack** — build `plugin.zip`
3. **release** — git tag, push, and cut the GitHub release with the artifact
4. **preflight** — the gates that need the tag and the release to exist
5. **submit** — open the PR against the MooNs-Plugins registry

Step 1 comes first for a reason: a GitHub release is effectively immutable, because
the registry pins its sha256. If a check fails, **nothing is packed, tagged, pushed
or released** — so you can fix it and re-run against the same version. (`--no-checks`
skips step 1; it is an escape hatch for a re-run, never right on a first publish.)

Needs `git` and an authenticated `gh`. It prints the PR URL at the end.

**Updating** a listed plugin: bump `version` in the manifest, commit, and run
`publish` again with the new tag — it detects the existing entry and prepends the
new version, newest-first.

Prefer to drive the steps yourself? They still exist individually — `pack`,
`release` (pack → GitHub release → entry), `preflight`, `submit` (opens the PR),
and `entry` (just prints the JSON).

### Signing (recommended — `publish` offers it)

In a terminal, `publish` **asks** whether to sign, and creates the key for you if you
have none — you don't have to know `--sign` or `keygen` exist. Scripts and CI are never
prompted: pass `--sign`.

A signature proves the artifact came from **you**, not just that its bytes match what
the registry saw. Signing is dependency-free Ed25519 over the artifact bytes.

It is a one-way door you may walk through **late**:

- Unsigned throughout is fine — the sha256 pin is the only guarantee, and MooNs accepts it.
- **Unsigned → signed later breaks nobody.** Nothing is pinned until a signed version
  installs, so adding a key at v1.4.0 is a real option, not a lost cause.
- **Signed → unsigned is refused forever**, on every instance that already has the plugin.
  `publish` refuses that at step 1, before anything is tagged or released.

So **back the key up** (`~/.MooNs-plugin/signing.key`). Losing it means you cannot ship an
update to your own plugin without a registry maintainer override.

```bash
npx moons-plugin-sdk publish --repo you/repo --tag v1.1.0 --sign   # or just answer the prompt
```

## Exports

- `definePlugin(def)` + all the plugin types (`PluginContext`, `PluginRoute`, `PluginJob`, `PhotoProvider`, `CalendarSource`).
- `PLUGIN_API_VERSION` — embed as `apiVersion` in your manifest.
- `validateManifest(json)` — the manifest rules the server loader uses.
- `createMockHost(opts)` (from `moons-plugin-sdk/testing`).
- `MooNs_UI_CSS`, `MooNs_THEME_JS`, `MooNs_UI_MARKER`, `injectMooNsUi(html)` — the design kit, for authors who inline it themselves (a bundler, a custom build). Most plugins just use the `<!-- MooNs:ui -->` marker instead.

## Commands

Run any of these with `npx moons-plugin-sdk <command>` (or the short `MooNs-plugin`
bin if you install the package). `MooNs-plugin help <command>` — or
`MooNs-plugin <command> --help` — prints a full page for any of them.

**The path:**

- `create [name] [--type t] [--template blank|notification-channel] [--interactive]` — scaffold a plugin; a wizard if you omit the name.
- `dev [dir] [--port 4317]` — run locally with a real request loop, SQLite `db:own`, and hot reload.
- `status [dir]` — where am I? what's left? Every offline registry gate as a checklist, plus the next command. Never fails.
- `publish [dir] --repo o/n --tag vX [--sign [key]] [--no-checks] [--no-preflight]` — **the lot**: check → pack → release → preflight → open the PR. In a terminal it offers to sign (and makes you a key); scripts pass `--sign`.

**Also:**

- `validate [dir]` — the gate: the same checks as `status`, but it exits non-zero.
- `pack [dir] [--out plugin.zip] [--json]` — build the artifact, print `sha256` + `size`. Refuses a plugin that could not *load*; does not enforce the publish gates, because packing is how you sideload a plugin to try it.
- `shot [dir] [--port 4317] [--out docs/screenshot.png] [--dark] [--no-serve]` — capture `docs/screenshot.png`. Needs Playwright.
- `keygen [--key file]` — create an Ed25519 signing key.
- `sign [zip] [--key file]` — print a signature + public key for an artifact.
- `entry --repo o/n --tag vX [--merge f] [--sign [key]] [--out f]` — emit the registry entry JSON.
- `preflight [dir] --repo o/n --tag vX [--entry f] [--all]` — the registry checks that need the network: the tag resolves to the pinned commit, the released artifact downloads and hashes, the id is not bound to another owner, and an update does not drop or rotate a published signing key.
- `submit [dir] --repo o/n --tag vX [--registry o/n] [--draft]` — open the registry PR for you.
- `release [dir] --repo o/n --tag vX [--sign [key]] [--merge f]` — pack → GitHub release → entry, without opening the PR.

## Update notice

Both CLIs (`MooNs-plugin` and `create-MooNs-plugin`) tell you when a newer SDK has been
published. This matters more than the usual "you're on an old version" nag: the
registry entry format, the manifest rules and the permission catalog all move with the
MooNs host, so a stale SDK can `pack` and `submit` an entry that today's registry CI
rejects.

It is powered by [`update-notifier`](https://github.com/sindresorhus/update-notifier),
the standard for npm CLIs:

- At most **once every 24 hours**, a detached background process asks
  `registry.npmjs.org` for this package's `latest` version and caches the answer under
  `$XDG_CONFIG_HOME/configstore/` (or `~/.config/…`).
- Your command **never waits for it** — the notice is printed from that cache, so a
  fresh install learns about an update on a later run.
- The notice goes to **stderr**, so `pack --json` and `entry` keep piping clean JSON.

The request is an unauthenticated GET for a public package — the same one `npm install`
makes (npm's servers see your IP, as for any download). MooNs has no telemetry, and this
isn't any. To turn it off:

```bash
export NO_UPDATE_NOTIFIER=1
```

It is already silent in CI (any `CI` env var), under `NODE_ENV=test`, and whenever
stdout isn't a terminal (i.e. when piped or redirected).

The SDK tooling in this repo is MIT. Your plugin is your own code under your own license.
