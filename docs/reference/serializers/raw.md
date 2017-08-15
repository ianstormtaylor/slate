
# `Raw`

```js
import { Raw } from 'slate'
```

The raw JSON serialized that ships by default with Slate. It converts a [`State`](../models/state.md) into a JSON object. 

In the raw format, text is represented as "ranges", which are a more compact way to represent the formatting applied to characters than the immutable model Slate uses internally.

When saving the data to size-sensitive places, the raw serializer can be told to omit properties that aren't _strictly_ required to deserialize later, reducing the serialized data's size. For example, if the dictionary of [`Data`](../models/data.md) for a [`Node`](../models/node.md) is empty, it will be omitted.

- [Example](#example)
- [Static Methods](#methods)
  - [`Raw.deserialize`](#rawdeserialize)
  - [`Raw.serialize`](#rawserialize)


## Example

```json
{
  "nodes": [
    {
      "kind": "block",
      "type": "paragraph",
      "nodes": [
        {
          "kind": "text",
          "ranges": [
            {
              "text": "The Slate editor gives you "
            },
            {
              "text": "complete",
              "marks": [
                {
                  "type": "italic"
                }
              ]
            },
            {
              "text": "control over the logic you can add. For example, it's fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with \"> \" you get a blockquote that looks like this:"
            }
          ]
        }
      ]
    },
    {
      "kind": "block",
      "type": "block-quote",
      "nodes": [
        {
          "kind": "text",
          "ranges": [
            {
              "text": "A wise quote."
            }
          ]
        }
      ]
    },
    {
      "kind": "block",
      "type": "paragraph",
      "nodes": [
        {
          "kind": "text",
          "ranges": [
            {
              "text": "Order when you start a line with \"## \" you get a level-two heading, like this:"
            }
          ]
        }
      ]
    },
    {
      "kind": "block",
      "type": "heading-two",
      "nodes": [
        {
          "kind": "text",
          "ranges": [
            {
              "text": "Try it out at "
            }
          ]
        },
        {
          "kind": "inline",
          "type": "link",
          "data": {
            "href": "http://slatejs.org"
          },
          "nodes": [
            {
              "kind": "text",
              "ranges": [
                {
                  "text": "http://slatejs.org"
                }
              ]
            }
          ]
        },
        {
          "kind": "text",
          "ranges": [
            {
              "text": "!"
            }
          ]
        }
      ]
    }
  ]
}

```


## Methods

### `Raw.deserialize`
`Raw.deserialize(object: Object, [options: Object]) => State`

Deserialize a raw JSON `object` into a [`State`](../models/state.md). 

You must pass the `terse: true` option if you want to deserialize a state that was previously serialized with `terse: true`.

If you are serializing directly for storage in a database, or in other scenarios where you know the state will not be tampered with, you can pass in a `normalize: false` option which will greatly speed up the deserialization time, since it doesn't need to ensure that the state is fully normalized.

### `Raw.serialize`
`Raw.serialize(state: State, [options: Object]) => Object`

Serialize a `state` into a raw JSON object. 

#### Options

* `terse` (Boolean, default `false`) — if you pass the `terse: true` option, the serialized format will omit properties that aren't _strictly_ required to deserialize later, reducing the serialized data's size. For example, if the dictionary of [`Data`](../models/data.md) for a [`Node`](../models/node.md) is empty, it will be omitted.
* `preserveKeys` (Boolean, default `false`) — set to `true` to preserve the keys on nodes in the serialized document and selection.
* `preserveSelection` (Boolean, default `false`) — set to `true` to add the [`Selection`](../models/selection.md) (`state.selection`) to the serialized output.
* `preserveStateData` (Boolean, default `false`) — set to `true` to add the `state.data` to the serialized output.
