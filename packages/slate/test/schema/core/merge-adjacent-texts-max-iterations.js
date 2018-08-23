export const schema = {}

export const input = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: Array.from({ length: 100 }).map(() => ({
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: 'a',
              marks: [],
            },
          ],
        })),
      },
    ],
  },
}

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        data: {},
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: 'a'.repeat(100),
                marks: [],
              },
            ],
          },
        ],
      },
    ],
  },
}
