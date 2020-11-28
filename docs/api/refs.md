# Ref

`Ref` objects store up-to-date references to a `Point` or `Range` object in the document.

## PointRef

`PointRef` objects keep a specific point in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Point` value.

```typescript
interface PointRef {
  current: Point | null
  affinity: 'forward' | 'backward' | null
  unref(): Point | null
}
```

### Static methods

###### `PointRef.transform(ref: PointRef, op: Operation)`

Transform the point refs current value by an `op`.

## RangeRef

`RangeRef` objects keep a specific range in a document synced over time as new operations are applied to the editor. You can access their property `current` at any time for the up-to-date `Range` value.

```typescript
interface RangeRef {
  current: Range | null
  affinity: 'forward' | 'backward' | 'outward' | 'inward' | null
  unref(): Range | null
}
```

### Static methods

###### `RangeRef.transform(ref: RangeRef, op: Operation)`

Transform the range refs current value by an `op`.
