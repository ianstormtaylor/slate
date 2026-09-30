---
'slate': patch
'slate-react': patch
---

- When deleting a void element backward from a cursor inside it, place the cursor before the removed void instead of moving it into the following node
- In Chrome and Safari, pressing Delete on a selected void now deletes forward instead of backward
