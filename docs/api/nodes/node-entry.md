# NodeEntry API

`NodeEntry` objects are returned when iterating over the nodes in a Slate document tree. They consist of an array with two elements: the `Node` and its `Path` relative to the root node in the document.

They are generics meaning that sometimes they will return a subset of `Node` types like an `Element` or `Text`.

```typescript
type NodeEntry<T extends Node = Node> = [T, Path]
```
