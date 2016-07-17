
# `Raw`

```js
import { Raw } from 'slate'
```

The raw JSON serialized that ships by default with Slate. It converts a [`State`](../models/state.md) into a JSON object. 

The raw JSON object created will omit default-value properties to reduce the serialized data's size. For example, if the dictionary of [`Data`](../models/data.md) for a [`Node`](../models/node.md) is empty, it will be omitted.

In the raw format, text is represented as "ranges", which are a more compact way to represent the formatting applied to characters than the immutable model Slate uses internally.

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
`Raw.deserialize(object: Object) => State`

Deserialize a raw JSON `object` into a [`State`](../models/state.md).

### `Raw.serialize`
`Raw.serialize(state: State) => Object`

Serialize a `state` into a raw JSON object.
