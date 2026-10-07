---
'slate-react': patch
---

Stop dropping Android input that arrives before the editor re-renders. When the node map was stale, `beforeinput` events were ignored, so the browser's native insert was overwritten by the next render. That lost the first character typed into an emptied editor, or every other character when typing fast. They now resolve against the editor's selection instead of the stale DOM.
