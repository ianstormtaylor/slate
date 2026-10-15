---
'slate-dom': minor
'slate-react': patch
---

Stop drops from throwing when the browser resolves the drop position outside of the editor. `<Editable>` resolved the target range from the drop coordinates via `caretRangeFromPoint`, which can land on a DOM node outside of the editor even though the event's target is inside it (e.g. when the page scrolled between the last `dragover` and the `drop`); the resulting "Cannot resolve a Slate point from DOM point" error escaped the event handler and the drop was lost. The dropped data now goes to the current selection instead (the end of the document without one), and internally dragged content stays where it is. `DOMEditor.findEventRange` gained a `suppressThrow` option for this and returns `null` when the range cannot be resolved.
