---
'slate-react': patch
---

Suppress the `findPath` throw when translating `beforeinput` target ranges in `<Editable>` (#3556). A browser target range can point at a DOM node no longer resolvable to a Slate node (stale `NODE_MAP` after a re-render, IME composition, cross-editor click); with `suppressThrow: false` the "Unable to find the path" error escaped the DOM event handler and crashed the app. The two `onDOMBeforeInput` call sites now use `suppressThrow: true` (matching the other `toSlateRange` sites) and degrade gracefully — fall back to synthetic handling, or skip the selection move.
