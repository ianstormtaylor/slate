---
'slate-react': patch
'slate-hyperscript': patch
---

Accept `undefined` explicitly in the optional `Editable`, `Slate`, `useSelected` and `createHyperscript` options, so their published types stay compatible with `exactOptionalPropertyTypes` after the TypeScript 6 upgrade.
