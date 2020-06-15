export const input = `
one
`.trim()

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'line',
        data: {},
        nodes: [
          {
            object: 'text',
            text: 'one',
            marks: [],
          },
        ],
      },
    ],
  },
}

export const options = {
  toJSON: true,
}
