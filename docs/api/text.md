# Text

`Text` objects represent the nodes that contain the actual text content of a Slate document along with any formatting properties. They are always leaf nodes in the document tree as they cannot contain any children.

```typescript
interface Text {
  text: string
  [key: string]: unknown
}
```

## Static methods

###### `Text.equals(text: Text, another: Text, options?): boolean`

Check if two text nodes are equal.

Options: `{loose?: boolean}`

###### `Text.isText(value: any): value is Text`

Check if a `value` implements the `Text` interface.

###### `Text.matches(text: Text, props: Partial<Text>): boolean`

Check if a `text` matches a set of `props`.

###### `Text.decorations(node: Text, decorations: Range[]): Text[]`

Get the leaves for a text node, given `decorations`.
