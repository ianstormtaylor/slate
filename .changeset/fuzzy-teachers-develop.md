---
'slate-react': patch
---

toSlatePoint should not consider a selection within a void node if the void node isn't in the editor itself.

Prior to this fix, a nested Slate editor inside a void node in a parent editor would not allow you to start typing text in a blank editor state correctly. After the first character insertion, the selection would jump back to the start of the nested editor.
