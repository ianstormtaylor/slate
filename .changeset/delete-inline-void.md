---
'slate-react': patch
---

Fix deletion of selected inline void nodes in Chrome. Chrome does not fire a `beforeinput` event when deleting backwards within an inline void node, so we need to add special logic to handle this edge-case for Chrome only.
