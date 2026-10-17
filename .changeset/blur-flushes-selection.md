---
'slate-react': patch
---

A DOM selection change made just before the editor loses focus now reaches `editor.selection`. Selection changes are processed a little later than they happen, and since 0.142 changes processed after blur were ignored, so for example clicking an element whose handler blurs the editor could leave `editor.selection` where it was before the click. Blur now processes any pending selection change first.
