---
'slate-react': patch
---

Fix the DOM getting out of sync with the Slate document when a custom `insertText` intentionally does nothing (#5152). Single-character insertion is handled natively for performance (skipping `preventDefault` and letting the browser insert the character directly), with `Editor.insertText` deferred until the following `input` event. If a custom `insertText` override ignores the character, no Slate operation is applied, so no re-render happens to reconcile the DOM via `<TextString>`'s layout effect — the browser-inserted character was left stranded in the DOM even though the Slate document correctly didn't change. `<Editable>` now verifies the affected text node's DOM content against the model right after flushing the deferred operation, and corrects it (restoring the caret afterward, since replacing `textContent` resets it) if the two have diverged.
