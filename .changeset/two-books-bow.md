---
'slate': patch
---

New `editor` method that can be overridden to control when the normalization should stop. Default behavior (unchanged) is to throw an error when it iterates over 42 times the dirty paths length.

```ts
shouldNormalize: ({
  iteration,
  dirtyPaths,
  operation,
}: {
  iteration: number
  dirtyPaths: Path[]
  operation?: Operation
}) => boolean
```

- `editor.onChange` signature change: `(options?: { operation?: Operation }) => void` where `operation` is triggering the function.
- `editor.normalizeNode` signature change: `(entry: NodeEntry, options?: { operation?: Operation }) => void` where `operation` is triggering the function.
- `EditorNormalizeOptions` new option `operation?: Operation` where `operation` is triggering the function.
