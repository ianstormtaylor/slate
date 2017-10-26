/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'], max: 1 },
      ]
    }
  }
}

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
      </quote>
    </document>
  </state>
)
