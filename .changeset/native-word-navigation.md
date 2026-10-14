---
'slate-react': patch
---

Use native selection word boundaries for word-navigation shortcuts so Option/Ctrl+Arrow respects native punctuation and language boundaries while synchronizing Slate's selection in the same key event. Fall back to Slate's word transform when native selection movement is unavailable.
