---
'slate-react': minor
---

**Add directional awareness to `Editor.deleteFragment`.** This is an obscure change, but is a required distinction when implementing features that need to "fake delete" content (like Google Docs's suggestions). Previously deleting always collapsed to the end of a range, but now it can collapse forwards as well.
