
# Packages

Slate's codebase is monorepo managed with [Lerna](https://lernajs.io/). It consists of a handful of packages—although you won't always use all of them. They are:

- [`slate`](./slate) — which includes Slate's core logic.
- [`slate-react`](./slate) — the React components for rendering Slate editors.
- [`slate-hyperscript`](./slate-hyperscript) — a hyperscript helper to write Slate documents in JSX!

And some others...

- [`slate-base64-serializer`](./slate-base64-serializer) — a Base64 string serializer for Slate documents.
- [`slate-dev-logger`](./slate-logger) — a simpler development-only logger for Slate.
- [`slate-html-serializer`](./slate-html-serializer) — an HTML serializer for Slate documents.
- [`slate-plain-serializer`](./slate-plain-serializer) — a plain text serializer for Slate documents.
- [`slate-prop-types`](./slate-prop-types) — a set of React prop types for checking Slate values.
- [`slate-simulator`](./slate-simulator) — a simulator for testing Slate editors and plugins.
