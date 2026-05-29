---
'slate-hyperscript': minor
---

- Introduced new `HyperscriptPointRef` and `HyperscriptRangeRef` classes.
  - A `HyperscriptPointRef` can passed to the `ref` prop of the new `<point />` tag to store any arbitrary point in the editor.
  - To access the point, call the `point()` method on the `HyperscriptPointRef` instance.
  - A `HyperscriptRangeRef` can be passed to the `ref` prop of an `<anchor />` or `<focus />` tag to construct an arbitrary range.
  - `<anchor />` and `<focus />` tags used in this manner do not affect `editor.selection`.
  - To access the range, call the `range()` method on the `HyperscriptRangeRef` instance.
