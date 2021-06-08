# Point

`Point` objects refer to a specific location in a text node in a Slate document. Its `path` refers to the location of the node in the tree, and its offset refers to distance into the node's string of text. Points may only refer to `Text` nodes.

```typescript
interface Point {
  path: Path
  offset: number
}
```

- [Static methods](point.md#static-methods)
  - [Retrieval methods](point.md#retrieval-methods)
  - [Check methods](point.md#check-methods)
  - [Transform methods](point.md#transform-methods)

## Static methods

### Retrieval methods

#### `Point.compare(point: Point, another: Point) => -1 | 0 | 1`

Compare a `point` to `another`, returning an integer indicating whether the point was before, at or after the other.

### Check methods

#### `Point.isAfter(point: Point, another: Point) => boolean`

Check if a `point` is after `another`.

#### `Point.isBefore(point: Point, another: Point) => boolean`

Check if a `point` is before `another`.

#### `Point.equals(point: Point, another: Point) => boolean`

Check if a `point` is exactly equal to `another`.

#### `Point.isPoint(value: any) => value is Point`

Check if a `value` implements the `Point` interface.

### Transform methods

#### `Point.transform(point: Point, op: Operation, options?) => Point | null`

Transform a `point` by an `op`.

Options: `{affinity?: 'forward' | 'backward' | null}`
