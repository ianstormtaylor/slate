---
'slate-dom': patch
'slate-react': patch
---

Keep input, selection and history events from native contenteditable regions nested inside non-editable containers out of the surrounding Slate editor. Preserve Slate text and event hosts inside custom editable islands.
