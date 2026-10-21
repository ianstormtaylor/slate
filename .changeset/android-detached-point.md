---
'slate-dom': patch
---

On Android, `toSlatePoint` no longer throws `TypeError` reading `hasAttribute` of null when the DOM point is in a text node the keyboard has detached. It returns null with `suppressThrow`, and otherwise throws the usual "Cannot resolve a Slate point" error. Seen with Firefox for Android while accepting a keyboard suggestion in a new paragraph (#6343).
