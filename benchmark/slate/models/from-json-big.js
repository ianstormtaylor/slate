/* eslint-disable react/jsx-key */

const { Value } = require('slate')

module.exports.default = function(json) {
  Value.fromJSON(json)
}

const input = {
  object: 'value',
  document: {
    object: 'document',
    nodes: Array.from(Array(100)).map(() => ({
      object: 'block',
      type: 'list',
      data: {},
      nodes: Array.from(Array(10)).map(() => ({
        object: 'block',
        type: 'list-item',
        data: {},
        nodes: [
          {
            object: 'text',
            marks: [],
            text: '',
          },
          {
            type: 'link',
            object: 'inline',
            data: {
              id: 1,
            },
            nodes: [
              {
                object: 'text',
                marks: [],
                text: 'Some text for a link',
              },
            ],
          },
          {
            object: 'text',
            marks: [],
            text: '',
          },
        ],
      })),
    })),
  },
}

module.exports.input = function() {
  return input
}
