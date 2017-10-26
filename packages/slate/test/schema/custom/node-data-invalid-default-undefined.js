/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == 'value'
      },
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)

export const output = (
  <state>
    <document />
  </state>
)
