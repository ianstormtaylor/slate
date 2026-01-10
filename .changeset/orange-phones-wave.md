---
'slate': minor
'slate-react': patch
'slate-dom': patch
---

Added `Location.isPath`, `Location.isPoint`, `Location.isRange`, and `Location.isSpan` functions, as efficient type discriminators.
Use these instead of `Path.isPath`, `Point.isPoint`, `Range.isRange`, and `Span.isSpan` whenever possible.
