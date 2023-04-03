---
'slate': minor
---

- Add `isSelectable` to `editor` (default true). A non-selectable element is skipped over when navigating using arrow keys.
  - Add `ignoreNonSelectable` to `Editor.nodes`, `Editor.positions`, `Editor.after` and `Editor.before` (default false)
  - `Transforms.move` ignores non-selectable elements
