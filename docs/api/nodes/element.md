# Element

`Element` objects are a type of node in a Slate document that contain other `Element` nodes or `Text` nodes.

Element nodes behave differently depending on the [Slate editor's configuration](./editor.md#schema-specific-instance-methods-to-override). An element can be:

- "block" or "inline" as defined by `editor.isInline`
- either "void" or "not void" as defined by `editor.isVoid`

A "block" element can only be siblings with other "block" elements. AN "inline" node can be siblings with `Text` nodes or other "inline" elements.

In a not "void" element, Slate handles the rendering of its `children` (e.g. in a paragraph where the `Text` and `Inline` children are rendered by Slate). In a "void" element, the `children` are rendered by the `Element`s render code.

```typescript
interface Element {
  children: Node[]
}
```

- [Static methods](element.md#static-methods)
  - [Retrieval methods](element.md#retrieval-methods)
  - [Check methods](element.md#check-methods)

## Static methods

### Retrieval methods

#### `Element.matches(element: Element, props: Partial<Element>): boolean`

Check if an element matches a set of `props`. Note: This checks custom properties, but it does not ensure that any children are equivalent.

### Check methods

#### `Element.isElement(value: any): value is Element`

Check if a `value` implements the `Element` interface.

#### `Element.isElementList(value: any): value is Element[]`

Check if a `value` is an array of `Element` objects.
