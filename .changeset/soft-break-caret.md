---
'slate-react': patch
---

Fix typed text coming out reversed after a soft break at the end of a leaf in Chrome. Chrome reports the caret after a trailing `\n` as the start of the next text node, and Slate restored its own selection after each insert, so every character landed in front of the last.
