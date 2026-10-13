# PathRef API

`PathRef` objects keep a specific path in a document synced over time as new operations are applied to the editor. It is created using the `Editor.pathRef` method. You can access their property `current` at any time for the up-to-date `Path` value. When you no longer need to track this location, call `unref()` to free the resources. The `affinity` refers to the direction the `PathRef` will go when a user inserts content at the current position of the `Path`.

```typescript
interface PathRef {
  current: Path | null
  affinity: 'forward' | 'backward' | null
  unref(): Path | null
  [Symbol.dispose](): void
}
```

- [Instance methods](path-ref.md#instance-methods)
- [Static methods](path-ref.md#static-methods)
  - [Transform methods](path-ref.md#trasnform-methods)

## Instance methods

#### `unref() => Path | null`

Free the resources used by the PathRef. This should be called when you no longer need to track the path. Returns the final path value before being unrefed, or null if the path was already invalid.

This removes the ref from `Editor.pathRefs(editor)` and sets `current` to `null`. If an operation removes the tracked node, the editor releases the ref automatically. Calling `unref()` again returns `null`.

#### `[Symbol.dispose]() => void`

Release the ref by calling `unref()`. This supports `using` declarations in runtimes or build tools with explicit resource management support. Repeated disposal is safe, including after an operation removes the tracked location.

TypeScript consumers need TypeScript 5.2 or later with `esnext.disposable` in their `lib` configuration. If the runtime lacks `Symbol.dispose`, install a polyfill before creating refs to use `using`; the fallback key is `Symbol.for('Symbol.dispose')`. Calling `unref()` continues to work without a polyfill.

## Static methods

### Transform methods

#### `PathRef.transform(ref: PathRef, op: Operation)`

Transform the path refs current value by an `op`.
The editor calls this as needed, so normally you won't need to.
