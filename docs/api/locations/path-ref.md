# PathRef API

`PathRef` objects keep a specific path in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Path` value.
When you no longer need to track this location, call `unref()` to free the resources.

```typescript
interface PathRef {
  current: Path | null
  affinity: 'forward' | 'backward' | null
  unref(): Path | null
}
```

- [Static methods](path-ref.md#static-methods)
  - [Transform methods](path-ref.md#trasnform-methods)

## Static methods

### Transform methods

#### `PathRef.transform(ref: PathRef, op: Operation)`

Transform the path refs current value by an `op`.
The editor calls this as needed, so normally you won't need to.
