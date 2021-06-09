---
'slate-react': patch
---

Fix deletion of selected inline void nodes in Safari when presssing `backspace` or `delete`. This is a bug that [was originally fixed only for Google Chrome](https://github.com/ianstormtaylor/slate/issues/3456), but the fix also needs to be applied in Safari.
