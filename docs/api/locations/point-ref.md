# PointRef API

`PointRef` objects keep a specific point in a document synced over time as new operations are applied to the editor. It is created using the `Editor.pointRef` method. You can access their property `current` at any time for the up-to-date `Point` value. When you no longer need to track this location, call `unref()` to free the resources. The `affinity` refers to the direction the `PointRef` will go when a user inserts content at the current position of the `Point`.

```typescript
interface PointRef {
  current: Point | null
  affinity: 'forward' | 'backward' | null
  unref(): Point | null
  [Symbol.dispose](): void
}
```

- [Instance methods](point-ref.md#instance-methods)
- [Static methods](point-ref.md#static-methods)
  - [Transform methods](point-ref.md#trasnform-methods)

## Instance methods

#### `unref() => Point | null`

Call this when you no longer need to sync this point.
It also returns the current value.

This removes the ref from `Editor.pointRefs(editor)` and sets `current` to `null`. If an operation removes the node containing the point, the editor releases the ref automatically. Calling `unref()` again returns `null`.

#### `[Symbol.dispose]() => void`

Release the ref by calling `unref()`. This supports `using` declarations in runtimes or build tools with explicit resource management support. Repeated disposal is safe, including after an operation removes the tracked location.

TypeScript consumers need TypeScript 5.2 or later with `esnext.disposable` in their `lib` configuration. If the runtime lacks `Symbol.dispose`, install a polyfill before creating refs to use `using`; the fallback key is `Symbol.for('Symbol.dispose')`. Calling `unref()` continues to work without a polyfill.

## Static methods

### Transform methods

#### `PointRef.transform(ref: PointRef, op: Operation)`

Transform the point refs current value by an `op`.
The editor calls this as needed, so normally you won't need to.
