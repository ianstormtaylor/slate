---
'slate-react': patch
---

Fix composed text appearing twice in Chrome when the caret sits at the start of a leaf that follows marked text. Chrome composes into the end of the previous leaf, so its copy is removed before Slate inserts the text into the selected leaf.
