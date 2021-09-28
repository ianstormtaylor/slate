---
'slate-react': minor
---

The Slate Provider's "value" prop is now only used as initial state for editor.children as was intended before. If your code relies on replacing editor.children you should do so by replacing it directly instead of relying on the "value" prop to do this for you.
