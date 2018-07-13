export const input = [
  'slt1',
  1,
  [2, 'line', [['bold', ['italic', { very: true }], 'one']]],
]

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        data: {},
        isVoid: false,
        type: 'line',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                marks: [
                  {
                    data: {},
                    object: 'mark',
                    type: 'bold',
                  },
                  {
                    data: {
                      very: true,
                    },
                    object: 'mark',
                    type: 'italic',
                  },
                ],
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
