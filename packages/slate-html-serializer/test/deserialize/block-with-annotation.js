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
          case 'i': {
            return {
              object: 'annotation',
              type: 'highlight',
              key: 'a',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p>on<i>e</i></p><p><i>tw</i>o</p>
`.trim()

export const output = {
  object: 'value',
  annotations: {
    a: {
      object: 'annotation',
      type: 'highlight',
      key: 'a',
      anchor: { object: 'point', path: [0, 1], offset: 0 },
      focus: { object: 'point', path: [1, 0], offset: 2 },
      data: {},
    },
  },
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          { object: 'text', text: 'on', marks: [] },
          { object: 'text', text: 'e', marks: [] },
        ],
        data: {},
      },
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          { object: 'text', text: 'tw', marks: [] },
          { object: 'text', text: 'o', marks: [] },
        ],
        data: {},
      },
    ],
  },
}
