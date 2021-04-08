---
'slate-react': minor
'slate': patch
---

ReactNode previews and ability to customize it.

- Now previews can be any of ReactNode or ReactNodeArray
- Leaf component is fully refactored, no effects used anymore, just straight render.
- Preview styling moved to `DefaultLeaf` component so users now able to change it on their need via `Editable.renderLeaf`.
- `Editable` component has proper typing now.

BREAKING CHANGE: anyone using `Editable.renderLeaf` and not calling `DefaultLeaf` on placeholder leaves wont have placeholder displayed.
Sadly this is the only way to allow placeholder customisation.
