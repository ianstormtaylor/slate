---
'slate-react': patch
---

Keep typing into a focused `<input>` or `<textarea>` inside a void element. Since the caret is kept in the editor's text, a focused form control's selection was treated as a stray caret and moved back into the editor, so the control stopped accepting text.
