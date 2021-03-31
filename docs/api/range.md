# Range

`Range` objects are a set of points that refer to a specific span of a Slate document. They can define a span inside a single node or they can span across multiple nodes. The editor's `selection` is stored as a range.

```typescript
interface Range {
  anchor: Point
  focus: Point
  [key: string]: unknown
}
```

- [Static methods](#static-methods)
  - [Retrieval methods](#retrieval-methods)
  - [Check methods](#check-methods)
  - [Transform methods](#transform-methods)

## Static methods

### Retrieval methods

###### `Range.edges(range: Range, options?): [Point, Point]`

Get the start and end points of a `range`, in the order in which they appear in the document.

Options: `{reverse?: boolean}`

###### `Range.end(range: Range): Point`

Get the end point of a `range`.

###### `Range.intersection(range: Range, another: Range): Range | null`

Get the intersection of one `range` with `another`.

###### `Range.points(range: Range): Generator<PointEntry>`

Iterate through all the point entries in a `range`.

###### `Range.start(range: Range): Point`

Get the start point of a `range`

### Check methods

Check some attribute of a Range. Always returns a boolean.

###### `Range.equals(range: Range, another: Range): boolean`

Check if a `range` is exactly equal to `another`.

###### `Range.includes(range: Range, target: Path | Point | Range): boolean`

Check if a `range` includes a path, a point, or part of another range.

###### `Range.isBackward(range: Range): boolean`

Check if a `range` is backward, meaning that its anchor point appears _after_ its focus point in the document.

###### `Range.isCollapsed(range: Range): boolean`

Check if a `range` is collapsed, meaning that both its anchor and focus points refer to the exact same position in the document.

###### `Range.isExpanded(range: Range): boolean`

Check if a `range` is expanded. This is the opposite of `Range.isCollapsed` and is provided for legibility.

###### `Range.isForward(range: Range): boolean`

Check if a `range` is forward. This is the opposite of `Range.isBackward` and is provided for legibility.

###### `Range.isRange(value: any): value is Range`

Check if a `value` implements the `Range` interface.

### Transform methods

###### `Range.transform(range: Range, op: Operation, options): Range | null`

Transform a `range` by an `op`.

Options: `{affinity: 'forward' | 'backward' | 'outward' | 'inward' | null}`
