---
'slate-react': minor
---

Type `Editable`'s extra props as `div` attributes (`React.HTMLAttributes<HTMLDivElement>`) instead of `textarea` attributes. Textarea-only props such as `rows`, `cols`, `maxLength`, `wrap` and `value` never did anything on the editor's `div`; they now fail to type-check, so remove them.
