---
'slate-react': patch
'slate-dom': patch
---

Copy `initialValue` nodes that another editor is already using, so two `Slate` components given the same value render and edit independently instead of throwing "Unable to find the path for Slate node". Requires slate-dom 0.133.6 or newer.
