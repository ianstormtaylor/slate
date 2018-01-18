/** @jsx h */

import h from '../../helpers/h'

export const normalize = false

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
  // this change function and schema are designed such that if
  // validation takes place before both wrapBlock calls complete
  // the node gets deleted by the default schema
  // and causes a test failure
  let target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'list-item')
  target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'unordered-list')
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
