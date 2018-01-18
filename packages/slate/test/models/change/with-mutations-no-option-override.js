/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    'paragraph': {},
    'list-item': {
      parent: { types: ['unordered-list'] },
      nodes: [
        { objects: ['text'] }
      ]
    },
    'unordered-list': {},
  }
}

export const customChange = (change) => {
  // see if we can break the expected validation sequence by toggling
  // the normalization option
  let target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'list-item', { normalize: true })
  target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'unordered-list', { normalize: false })
}

export const input = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)

export const output = {
  object: 'value',
  document: {
    object: 'document',
    data: {},
    nodes: [
      {
        object: 'block',
        type: 'unordered-list',
        isVoid: false,
        data: {},
        nodes: [
          {
            object: 'block',
            type: 'list-item',
            isVoid: false,
            data: {},
            nodes: [
              {
                object: 'text',
                leaves: [
                  {
                    marks: [],
                    object: 'leaf',
                    text: ''
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}
