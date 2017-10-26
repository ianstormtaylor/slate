/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      text: /^\d*$/,
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        invalid
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
