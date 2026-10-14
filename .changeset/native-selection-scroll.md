---
'slate-react': patch
---

Call `scrollSelectionIntoView` when keyboard navigation moves a selection already synchronized with the DOM, including native movement between text lines. Custom callbacks can keep the caret clear of sticky headers. Renders and edits without user input remain excluded from this additional scrolling path.
