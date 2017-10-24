/** @jsx h */

import h from '../../../helpers/h'

export const schema = {
  document: {
    nodes: ['paragraph'],
    defaults: {
      nodes: ['paragraph']
    }
  },
  blocks: {
    paragraph: {},
  }
}

export const input = (
  <state>
    <document>
      <paragraph />
      <quote />
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)
