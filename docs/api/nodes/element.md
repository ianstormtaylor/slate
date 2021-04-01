# Element

`Element` objects are a type of node in a Slate document that contain other `Element` nodes or `Text` nodes. They can be either "blocks" or "inlines" depending on the Slate editor's configuration.

```typescript
interface Element {
  children: Node[]
}
```

* [Static methods](element.md#static-methods)
  * [Retrieval methods](element.md#retrieval-methods)
  * [Check methods](element.md#check-methods)

## Static methods

### Retrieval methods

#### `Element.matches(element: Element, props: Partial<Element>): boolean`

Check if an element matches a set of `props`. Note: This checks custom properties, but it does not ensure that any children are equivalent.

### Check methods

#### `Element.isElement(value: any): value is Element`

Check if a `value` implements the `Element` interface.

#### `Element.isElementList(value: any): value is Element[]`

Check if a `value` is an array of `Element` objects.

