---
'slate-react': patch
---

Remove text an IME composes into a selected void element. Slate doesn't insert text into voids, so the browser's copy was left in the void's DOM.
