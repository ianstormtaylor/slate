---
'slate': minor
---

`createEditor` takes an optional type parameter. `createEditor()` still returns `Editor`; `createEditor<BaseEditor>()` returns a plain `BaseEditor`, so a plugin chain is type-checked against the plugins actually applied rather than the fully extended `CustomTypes` editor.
