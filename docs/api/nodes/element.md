# Element

`Element` objects are a type of node in a Slate document that contain other `Element` nodes or `Text` nodes.

```typescript
interface Element {
  children: Node[]
}
```

- [Behavior Types](element.md#element-behavior-types)
  - [Block vs. Inline](element.md#block-vs-inline)
  - [Void vs Not Void](element.md#void-vs-not-void)
- [Static methods](element.md#static-methods)
  - [Retrieval methods](element.md#retrieval-methods)
  - [Check methods](element.md#check-methods)

## Element Behavior Types

Element nodes behave differently depending on the [Slate editor's configuration](./editor.md#schema-specific-instance-methods-to-override). An element can be:

- "block" or "inline" as defined by `editor.isInline`
- either "void" or "not void" as defined by `editor.isVoid`

### Block vs. Inline

A "block" element can only be siblings with other "block" elements. An "inline" node can be siblings with `Text` nodes or other "inline" elements.

### Void vs Not Void

In a not "void" element, Slate handles the rendering of its `children` (e.g. in a paragraph where the `Text` and `Inline` children are rendered by Slate). In a "void" element, the `children` are rendered by the `Element`'s render code.

## Static methods

### Retrieval methods

#### `Element.matches(element: Element, props: Partial<Element>) => boolean`

Check if an element matches a set of `props`. Note: This checks custom properties, but it does not ensure that any children are equivalent.

### Check methods

#### `Element.isElement(value: any) => value is Element`

Check if a `value` implements the `Element` interface.

#### `Element.isElementList(value: any) => value is Element[]`

Check if a `value` is an array of `Element` objects.
