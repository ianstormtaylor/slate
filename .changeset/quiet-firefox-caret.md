---
'slate-react': patch
'slate-dom': patch
---

Keep the Firefox caret on the new line after a trailing soft break without adding zero-width characters to the document. Preserve selection offsets and copied text around the extra rendering newline.

Requires slate-dom 0.133.5 or newer for the matching DOM selection mapping.
