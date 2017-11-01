/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </value>
)

export const output = {
  kind: 'value',
  document: {
    kind: 'document',
    key: '4',
    data: {},
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        key: '1',
        data: {},
        isVoid: false,
        nodes: [
          {
            kind: 'text',
            key: '0',
            leaves: [
              {
                text: 'one',
                kind: 'leaf',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  },
  selection: {
    kind: 'range',
    anchorKey: '0',
    anchorOffset: 0,
    focusKey: '0',
    focusOffset: 0,
    isBackward: false,
    isFocused: false,
    marks: null,
  }
}

export const options = {
  preserveKeys: true,
  preserveSelection: true,
}
