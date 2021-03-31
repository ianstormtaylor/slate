# Node Types

The `Node` union type represents all of the different types of nodes that occur in a Slate document tree.

```typescript
type Node = Editor | Element | Text

type Descendant = Element | Text
type Ancestor = Editor | Element
```

- [Node](./api/node.md)
- [Editor](./api/editor.md)
- [Element](./api/element.md)
- [Text](./api/text.md)
