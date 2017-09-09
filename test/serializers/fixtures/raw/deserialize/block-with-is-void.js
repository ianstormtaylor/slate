/** @jsx sugar */

import sugar from '../../../../helpers/sugar'

export const input = {
  document: {
    nodes: [
      {
        kind: 'block',
        type: 'image',
        isVoid: true,
      }
    ]
  }
}

export const output = (
  <state>
    <document>
      <image />
    </document>
  </state>
)
