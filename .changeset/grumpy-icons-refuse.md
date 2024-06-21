---
'slate-react': patch
---

Fix: `state.isDraggingInternally` is stale if a drop handler outside the editor causes the dragged DOM element to unmount
