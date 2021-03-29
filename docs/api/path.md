# Path

`Path` arrays are a list of indexes that describe a node's exact position in a Slate node tree. Although they are usually relative to the root `Editor` object, they can be relative to any `Node` object.

```typescript
type Path = number[]
```

## Static methods

###### `ancestors(path: Path, options: { reverse?: boolean } = {}): Path[]`

Get a list of ancestor paths for a given path.

The paths are sorted from deepest to shallowest ancestor. However, if the
`reverse: true` option is passed, they are reversed.

###### `common(path: Path, another: Path): Path`

Get the common ancestor path of two paths.

###### `compare(path: Path, another: Path): -1 | 0 | 1`

Compare a path to another, returning an integer indicating whether the path
was before, at, or after the other.

Note: Two paths of unequal length can still receive a `0` result if one is
directly above or below the other. If you want exact matching, use
[[Path.equals]] instead.

###### `endsAfter(path: Path, another: Path): boolean`

Check if a path ends after one of the indexes in another.

###### `endsAt(path: Path, another: Path): boolean`

Check if a path ends at one of the indexes in another.

###### `endsBefore(path: Path, another: Path): boolean`

Check if a path ends before one of the indexes in another.

###### `equals(path: Path, another: Path): boolean`

Check if a path is exactly equal to another.

###### `hasPrevious(path: Path): boolean`

Check if the path of previous sibling node exists

###### `isAfter(path: Path, another: Path): boolean`

Check if a path is after another.

###### `isAncestor(path: Path, another: Path): boolean`

Check if a path is an ancestor of another.

###### `isBefore(path: Path, another: Path): boolean`

Check if a path is before another.

###### `isChild(path: Path, another: Path): boolean`

Check if a path is a child of another.

###### `isCommon(path: Path, another: Path): boolean`

Check if a path is equal to or an ancestor of another.

###### `isDescendant(path: Path, another: Path): boolean`

Check if a path is a descendant of another.

###### `isParent(path: Path, another: Path): boolean`

Check if a path is the parent of another.

###### `isPath(value: any): value is Path`

Check is a value implements the `Path` interface.

###### `isSibling(path: Path, another: Path): boolean`

Check if a path is a sibling of another.

###### `levels(path: Path, options?): Path[]`

Get a list of paths at every level down to a path. Note: this is the same
as `Path.ancestors`, but including the path itself.

The paths are sorted from shallowest to deepest. However, if the `reverse: true` option is passed, they are reversed.

Options: `{reverse?: boolean}`

###### `next(path: Path): Path`

Given a path, get the path to the next sibling node.

###### `parent(path: Path): Path`

Given a path, return a new path referring to the parent node above it.

###### `previous(path: Path): Path`

Given a path, get the path to the previous sibling node.

###### `relative(path: Path, ancestor: Path): Path`

Get a path relative to an ancestor.

###### `transform(path: Path, operation: Operation, options?): Path | null`

Transform a path by an operation.

Options: `{ affinity?: 'forward' | 'backward' | null }`
