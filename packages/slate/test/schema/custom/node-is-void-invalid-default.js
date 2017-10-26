/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      isVoid: false,
    }
  }
}

export const input = (
  <state>
    <document>
      <block type="paragraph" isVoid />
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        {' '}
      </paragraph>
    </document>
  </state>
)
