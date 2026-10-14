---
'slate': patch
---

Restore the faster `Text.equals` comparison for `loose: true` without `ignore`. 0.138.0 routed every loose comparison through a generic property filter, which made loose comparisons, used when normalization merges adjacent text nodes, about 1.8x slower.
