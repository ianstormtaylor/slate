# Node Types APIs

The `Node` union type represents all of the different types of nodes that occur in a Slate document tree.

```typescript
type Node = Editor | Element | Text

type Descendant = Element | Text
type Ancestor = Editor | Element
```

- [Node](./node.md)
- [NodeEntry](./node-entry.md)
- [Editor](./editor.md)
- [Element](./element.md)
- [Text](./text.md)
