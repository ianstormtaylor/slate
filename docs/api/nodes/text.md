# Text API

`Text` objects represent the nodes that contain the actual text content of a Slate document along with any formatting properties. They are always leaf nodes in the document tree as they cannot contain any children.

```typescript
interface Text {
  text: string
}
```

- [Static methods](text.md#static-methods)
  - [Retrieval methods](text.md#retrieval-methods)
  - [Check methods](text.md#check-methods)

## Static methods

### Retrieval methods

#### `Text.matches(text: Text, props: Partial<Text>) => boolean`

Check if `text` matches a set of `props`.

The way the check works is that it makes sure that (a) all the `props` exist in the `text`, and (b) if it exists, that it exactly matches the properties in the `text`.

If a `props.text` property is passed in, it will be ignored.

If there are properties in `text` that are not in `props`, those will be ignored when it comes to testing for a match.

#### `Text.decorations(node: Text, decorations: Range[]) => Text[]`

Get the leaves for a text node, given `decorations`.

### Check methods

#### `Text.equals(text: Text, another: Text, options?) => boolean`

Check if two text nodes are equal.

Options: `{loose?: boolean}`

- `loose?`: When `true`, it checks if the properties of the `Text` object are equal except for the `text` property (i.e. the `String` value of the `Text`). When `false` (default), checks all properties including `text`.

#### `Text.isText(value: any) => value is Text`

Check if a `value` implements the `Text` interface.

#### `Text.isTextList(value: any): value is Text[]`

Check if `value` is an `Array` of only `Text` objects.
