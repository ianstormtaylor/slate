---
'slate-react': minor
---

`initialValue` on `<Slate>` is now optional. When it's left out, the editor's existing `editor.children` are used, for editors created and filled ahead of rendering. Leaving it out while `editor.children` is empty throws with a hint to pass `initialValue={[]}` if an empty editor is intended.
