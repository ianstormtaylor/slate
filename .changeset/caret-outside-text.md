---
'slate-react': patch
---

Keep the caret in the editor's text when the browser moves it to a spot Slate can't represent, such as below a table that ends the document after pressing ArrowDown. Typing there used to insert the character twice: once in the last cell and once as stray text outside the table.
