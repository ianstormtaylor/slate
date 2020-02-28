# Location

The `Location` interface is a union of the ways to refer to a specific location in a Slate document: paths, points or ranges. Methods will often accept a `Location` instead of requiring only a `Path`, `Point` or `Range`. 

```typescript
type Location = Path | Point | Range
```

## Path

`Path` arrays are a list of indexes that describe a node's exact position in a Slate node tree. Although they are usually relative to the root `Editor` object, they can be relative to any `Node` object.

```typescript
type Path = number[]
```

## Point

`Point` objects refer to a specific location in a text node in a Slate document. Its `path` refers to the lcoation of the node in the tree, and its offset refers to distance into the node's string of text. Points may only refer to `Text` nodes.

```typescript
interface Point {
    path: Path
    offset: number  
    [key: string]: any
}
```

## Range

`Range` objects are a set of points that refer to a specific span of a Slate document. They can define a span inside a single node or they can span across multiple nodes. The editor's `selection` is stored as a range.

```typescript
interface Range {
    anchor: Point
    focus: Point
    [key: string]: any
}
```
