/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == null || v == 'value'
      },
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph thing="invalid" />
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
