---
'slate-react': patch
---

Fix clicks occasionally being undone when the editor re-renders right after them. A render inside the 100 ms selection-change throttle used to write the previous selection back to the DOM; it now applies the clicked selection instead.
