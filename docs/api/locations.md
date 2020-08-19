# Location

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`.

```typescript
type Location = Path | Point | Range
```

## Static methods

###### `Location.isLocation(value: any): value is Location`

Check if a value implements the `Location` interface.

## Path

`Path` arrays are a list of indexes that describe a node's exact position in a Slate node tree. Although they are usually relative to the root `Editor` object, they can be relative to any `Node` object.

```typescript
type Path = number[]
```

## Point

`Point` objects refer to a specific location in a text node in a Slate document. Its `path` refers to the location of the node in the tree, and its offset refers to distance into the node's string of text. Points may only refer to `Text` nodes.

```typescript
interface Point {
  path: Path
  offset: number
  [key: string]: unknown
}
```

## Static methods

###### `Point.compare(point: Point, another: Point): -1 | 0 | 1`

Compare a `point` to `another`, returning an integer indicating whether the point was before, at or after the other.

###### `Point.isAfter(point: Point, another: Point): boolean`

Check if a `point` is after `another`.

###### `Point.isBefore(point: Point, another: Point): boolean`

Check if a `point` is before `another`.

###### `Point.equals(point: Point, another: Point): boolean`

Check if a `point` is exactly equal to `another`.

###### `Point.isPoint(value: any): value is Point`

Check if a `value` implements the `Point` interface.

###### `Point.transform(point: Point, op: Operation, options?): Point | null`

Transform a `point` by an `op`.

Options: `{affinity?: 'forward' | 'backward' | null}`

## Range

`Range` objects are a set of points that refer to a specific span of a Slate document. They can define a span inside a single node or they can span across multiple nodes. The editor's `selection` is stored as a range.

```typescript
interface Range {
  anchor: Point
  focus: Point
  [key: string]: unknown
}
```

###### `Range.edges(range: Range, options?): [Point, Point]`

Get the start and end points of a `range`, in the order in which they appear in the document.

Options: `{reverse?: boolean}`

###### `Range.end(range: Range): Point`

Get the end point of a `range`.

###### `Range.equals(range: Range, another: Range): boolean`

Check if a `range` is exactly equal to `another`.

###### `Range.includes(range: Range, target: Path | Point | Range): boolean`

Check if a `range` includes a path, a point, or part of another range.

###### `Range.intersection(range: Range, another: Range): Range | null`

Get the intersection of one `range` with `another`.

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

###### `Range.points(range: Range): Generator<PointEntry>`

Iterate through all the point entries in a `range`.

###### `Range.start(range: Range): Point`

Get the start point of a `range`

###### `Range.transform(range: Range, op: Operation, options): Range | null`

Transform a `range` by an `op`.

Options: `{affinity: 'forward' | 'backward' | 'outward' | 'inward' | null}`
