# PointRef API

`PointRef` objects keep a specific point in a document synced over time as new operations are applied to the editor. It is created using the `Editor.pointRef` method. You can access their property `current` at any time for the up-to-date `Point` value. When you no longer need to track this location, call `unref()` to free the resources. The `affinity` refers to the direction the `PointRef` will go when a user inserts content at the current position of the `Point`.

```typescript
interface PointRef {
  current: Point | null
  affinity: 'forward' | 'backward' | null
  unref(): Point | null
}
```

- [Instance methods](point-ref.md#instance-methods)
- [Static methods](point-ref.md#static-methods)
  - [Transform methods](point-ref.md#trasnform-methods)

## Instance methods

#### `unRef() => Point`

Call this when you no longer need to sync this point.
It also returns the current value.

## Static methods

### Transform methods

#### `PointRef.transform(ref: PointRef, op: Operation)`

Transform the point refs current value by an `op`.
The editor calls this as needed, so normally you won't need to.
