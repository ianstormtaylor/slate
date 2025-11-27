---
'slate-react': patch
---

Fix Android handwriting input where first stroke commits prematurely on empty lines (e.g., '我' becomes '一我').

**Cause:** When writing the first character of an empty line, Android handwriting triggers childList mutations (creating new DOM structure). These mutations get restored by RestoreDOM during React re-render, which interrupts the IME composition session.

**Fix:** Skip flush during composition only when at the first character of an empty line. This targeted fix preserves normal onChange behavior for other scenarios while preventing the handwriting issue.

