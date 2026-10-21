---
'slate': patch
'slate-dom': patch
'slate-react': patch
---

API docs are now auto-generated from code and JSDoc comments!

Created `TransformsInterface`, it is the type of the `Transforms` object.

Converted static helper type function syntax from `f: (x: y) => z` to `f(x: y): z` for better documentation. This is a type-only change, and functionally identical except when passing the functions as a value in tsconfig setups that are very strict about binding. This was already true for some interfaces but is now consistent. Affected types are: `EditorInterface`, `ElementInterface`, `LocationInterface`, `SpanInterface`, `NodeInterface`, `OperationInterface`, `PathRefInterface`, `PathInterface`, `PointRefInterface`, `PointInterface`, `RangeRefInterface`, `RangeInterface`, `TextInterface`, the new `TransformsInterface`, and `DOMEditorInterface` (and by extension `ReactEditorInterface`), 
