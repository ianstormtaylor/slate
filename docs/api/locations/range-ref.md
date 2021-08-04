# RangeRef

`RangeRef` objects keep a specific range in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Range` value.

```typescript
interface RangeRef {
  current: Range | null
  affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
  unref(): Range | null
}
```

- [Static methods](range-ref.md#static-methods)
  - [Transform methods](range-ref.md#transform-methods)

## Static methods

### Transform methods

#### `RangeRef.transform(ref: RangeRef, op: Operation)`

Transform the range refs current value by an `op`.
