---
'slate-react': patch
---

The default `scrollSelectionIntoView` now scrolls just enough to reveal the caret (`block: 'nearest'`) instead of centering it, so moving the caret with the arrow keys past the edge of the viewport no longer jumps the page by half a screen. Pass your own `scrollSelectionIntoView` to keep centering.
