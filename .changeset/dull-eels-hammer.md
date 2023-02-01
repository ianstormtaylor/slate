---
'slate-react': minor
---

If TextComponent decorations keep the same offsets and only paths are changed, prevent re-rendering because only decoration offsets matter when leaves are calculated.
