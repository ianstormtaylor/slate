export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'p': {
            return {
              object: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p>one</p>
`.trim()

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'one',
              },
            ],
          },
        ],
      },
    ],
  },
}

export const options = {
  toJSON: true,
}
