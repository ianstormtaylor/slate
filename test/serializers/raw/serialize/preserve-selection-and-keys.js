/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)

export const output = {
  kind: 'state',
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
            ranges: [
              {
                text: 'one',
                kind: 'range',
                marks: []
              }
            ]
          }
        ]
      }
    ]
  },
  selection: {
    kind: 'selection',
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
