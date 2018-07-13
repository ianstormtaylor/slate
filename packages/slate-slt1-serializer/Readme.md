# slate-slt1-serializer

This package contains the slt1 serializer for Slate documents.

The Slate Data Model is good for editing, but not so good for storing. Furthermore, it might change in the future.

This serializer is meant to provide a stable and compact format for storing Slate documents in a lossless manner.

As an example example, these are equivalent:

slt1:

```json
["slt1", 1, [2, "line", [["bold", ["italic", { "very": true }], "one"]]]]
```

slate-hyperscript:

```html
  <value>
    <document>
      <line><b><i very>one</i></b></line>
    </document>
  </value>
```

slate data model - JSON version:

```json
{
  "object": "value",
  "document": {
    "object": "document",
    "data": {},
    "nodes": [
      {
        "object": "block",
        "data": {},
        "isVoid": false,
        "type": "line",
        "nodes": [
          {
            "object": "text",
            "leaves": [
              {
                "marks": [
                  {
                    "data": {},
                    "object": "mark",
                    "type": "bold"
                  },
                  {
                    "data": {
                      "very": true
                    },
                    "object": "mark",
                    "type": "italic"
                  }
                ],
                "object": "leaf",
                "text": "one"
              }
            ]
          }
        ]
      }
    ]
  }
}
```
