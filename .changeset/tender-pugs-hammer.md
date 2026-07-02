---
'slate-react': patch
---

Suppress the `findPath` throw when translating `beforeinput` target ranges in `<Editable>`. The browser's target range can point at a DOM node that is no longer resolvable to a Slate node (stale NODE_MAP entry after a re-render, IME composition, cross-editor click); with `suppressThrow: false` the "Unable to find the path for Slate node" error escaped the DOM event handler and crashed the app (#3556). The two `onDOMBeforeInput` call sites now use `suppressThrow: true` — matching the other `toSlateRange` call sites in the file — and degrade gracefully: the `getTargetRanges` branch falls back to slate's synthetic handling at the current selection, the WebKit ShadowRoot branch skips only the selection move.
