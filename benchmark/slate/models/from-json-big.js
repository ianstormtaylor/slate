/* eslint-disable react/jsx-key */

const { Value } = require('slate')

module.exports.default = function(json) {
  Value.fromJSON(json)
}

const input = {
  document: {
    nodes: Array.from(Array(100)).map(() => ({
      type: 'list',
      object: 'block',
      data: {},
      nodes: Array.from(Array(10)).map(() => ({
        type: 'list-item',
        object: 'block',
        data: {},
        nodes: [
          {
            leaves: [
              {
                object: 'leaf',
                marks: [],
                text: '',
              },
            ],
            object: 'text',
          },
          {
            type: 'link',
            object: 'inline',
            data: {
              id: 1,
            },
            nodes: [
              {
                leaves: [
                  {
                    object: 'leaf',
                    marks: [],
                    text: 'Some text for a link',
                  },
                ],
                object: 'text',
              },
            ],
          },
          {
            leaves: [
              {
                object: 'leaf',
                marks: [],
                text: '',
              },
            ],
            object: 'text',
          },
        ],
      })),
    })),
  },
}

module.exports.input = function() {
  return input
}
