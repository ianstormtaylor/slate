---
'slate-react': patch
'slate': patch
---

Abstracted input reconciliation logic out of `Editable` component into `useInputReconciler` hook to manage input reconciliation logic.

Input reconciliation has been broken down into the following layers to help create a better separation of concerns:

- Composition
- Clipboard (copy, cut, paste)
- Drag and drop
- Focus
- Selection
