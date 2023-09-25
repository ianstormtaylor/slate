# Path API

`Path` arrays are a list of indexes that describe a node's exact position in a Slate node tree. Although they are usually relative to the root `Editor` object, they can be relative to any `Node` object.

```typescript
type Path = number[]
```

- [Static methods](path.md#static-methods)
  - [Retrieval methods](path.md#retrieval-methods)
  - [Check methods](path.md#check-methods)
  - [Transform method](path.md#transform-method)

## Static methods

### Retrieval methods

#### `Path.ancestors(path: Path, options: { reverse?: boolean } = {}) => Path[]`

Get a list of ancestor paths for a given path.

The paths are sorted from shallowest to deepest ancestor. However, if the `reverse: true` option is passed, they are reversed.

#### `Path.common(path: Path, another: Path) => Path`

Get the common ancestor path of two paths.

#### `Path.compare(path: Path, another: Path) => -1 | 0 | 1`

Compare a path to another, returning an integer indicating whether the path was before, at, or after the other.

Note: Two paths of unequal length can still receive a `0` result if one is directly above or below the other. If you want exact matching, use \[\[Path.equals\]\] instead.

#### `Path.levels(path: Path, options?) => Path[]`

Get a list of paths at every level down to a path. Note: this is the same as `Path.ancestors`, but includes the path itself.

The paths are sorted from shallowest to deepest. However, if the `reverse: true` option is passed, they are reversed.

Options: `{reverse?: boolean}`

#### `Path.next(path: Path) => Path | undefined`

Given a path, gets the path to the next sibling node. The method does not ensure that the returned `Path` is valid in the document.

#### `Path.parent(path: Path) => Path | undefined`

Given a path, return a new path referring to the parent node above it. If the `path` argument is equal to `[]`, throws an error.

#### `Path.previous(path: Path) => Path | undefined`

Given a path, get the path to the previous sibling node. The method will return `undefined` if there are no previous siblings (e.g. if the Path is currently `[1, 0]`, the previous path would be `[1, -1]` which is illegal and will return `undefined`).

#### `Path.relative(path: Path, ancestor: Path) => Path | undefined`

Given two paths, one that is an ancestor to the other, returns the relative path from the `ancestor` argument to the `path` argument. If the `ancestor` path is not actually an ancestor or equal to the `path` argument, throws an error.

### Check methods

Check some attribute of a path. Always returns a boolean.

#### `Path.endsAfter(path: Path, another: Path) => boolean`

Check if a path ends after one of the indexes in another.

#### `Path.endsAt(path: Path, another: Path) => boolean`

Check if a path ends at one of the indexes in another.

#### `Path.endsBefore(path: Path, another: Path) => boolean`

Check if a path ends before one of the indexes in another.

#### `Path.equals(path: Path, another: Path) => boolean`

Check if a path is exactly equal to another.

#### `Path.hasPrevious(path: Path) => boolean`

Check if the path of previous sibling node exists

#### `Path.isAfter(path: Path, another: Path) => boolean`

Check if a path is after another.

#### `Path.isAncestor(path: Path, another: Path) => boolean`

Check if a path is an ancestor of another.

#### `Path.isBefore(path: Path, another: Path) => boolean`

Check if a path is before another.

#### `Path.isChild(path: Path, another: Path) => boolean`

Check if a path is a child of another.

#### `Path.isCommon(path: Path, another: Path) => boolean`

Check if a path is equal to or an ancestor of another.

#### `Path.isDescendant(path: Path, another: Path) => boolean`

Check if a path is a descendant of another.

#### `Path.isParent(path: Path, another: Path) => boolean`

Check if a path is the parent of another.

#### `Path.isPath(value: any) => value is Path`

Check is a value implements the `Path` interface.

#### `Path.isSibling(path: Path, another: Path) => boolean`

Check if a path is a sibling of another.

### Transform method

#### `Path.transform(path: Path, operation: Operation, options?) => Path | null`

Transform a path by an operation.

Options: `{ affinity?: 'forward' | 'backward' | null }`
