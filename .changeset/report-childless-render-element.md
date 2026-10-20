---
'slate-react': patch
---

Report an element whose `renderElement` didn't render its `children` through `editor.onDOMError` when it mounts, naming the element's `type` and path. Before, nothing was reported, and lookups into the element returned `null` with no hint why.
