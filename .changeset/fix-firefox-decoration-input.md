---
'slate-react': patch
---

Fix Firefox contenteditable text input breaking on editor mount, caused by a forced re-render added in `useDecorateContext` for decoration-driven caret restoration (#6078)
