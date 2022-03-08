---
'slate': minor
'slate-react': minor
---

A different behavior for inserting a soft break with shift+enter is quite common in rich text editors. Right now you have to do this in onKeyDown which is not so nice. This adds a separate insertSoftBreak method on the editor instance that gets called when a soft break is inserted. This maintains the current default behavior for backwards compatibility (it just splits the block). But at least you can easily overwrite it now.

If you rely on overwriting editor.insertBreak for extra behavior for soft breaks this might be a breaking change for you and you should overwrite editor.insertSoftBreak instead.
