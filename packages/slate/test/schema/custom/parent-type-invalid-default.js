/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    list: {},
    item: {
      parent: { types: ['list'] },
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        <item />
      </paragraph>
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
