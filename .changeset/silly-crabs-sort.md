---
'slate': patch
---

Performance: Use pure JS instead of Immer for applying operations and transforming points and ranges. Immer is now used only for producing fragments.
