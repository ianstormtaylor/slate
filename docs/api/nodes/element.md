# Element API

`Element` objects are a type of `Node` in a Slate document that contain other `Element` nodes or `Text` nodes.

```typescript
interface Element {
  children: Node[]
}
```

- [Behavior Types](element.md#element-behavior-types)
  - [Block vs. Inline](element.md#block-vs-inline)
  - [Void vs Not Void](element.md#void-vs-not-void)
    - [Rendering Void Elements](element.md#rendering-void-elements)
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

#### Rendering Void Elements

Void Elements must

- always have one empty child text node (for selection)
- render using `attributes` and `children` (so, their outermost HTML element **can't** be an HTML void element)
- set `contentEditable={false}` (for Firefox)

Typical rendering code will resemble this `thematic-break` (horizontal rule) element:

```javascript
return (
  <div {...attributes} contentEditable={false}>
    {children}
    <hr />
  </div>
)
```

## Static methods

### Retrieval methods

#### `Element.matches(element: Element, props: Partial<Element>) => boolean`

Check if an element matches a set of `props`. Note: This checks custom properties, but it does not ensure that any children are equivalent.

### Check methods

#### `Element.isAncestor(value: any) => value is Ancestor`

Check if a value implements the 'Ancestor' interface.

#### `Element.isElement(value: any) => value is Element`

Check if a `value` implements the `Element` interface.

#### `Element.isElementList(value: any) => value is Element[]`

Check if a `value` is an array of `Element` objects.

#### `Element.isElementType<T Extends Element>(value: any, elementVal: string, ElementKey: string = 'type'): value is T`

Check if a value implements the `Element` interface and has elementKey with selected value.
Default it check to `type` key value
