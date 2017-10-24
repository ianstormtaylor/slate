/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { kinds: ['text'] },
      ]
    }
  }
}

export const input = (
  <state>
    <document>
      <quote>
        <link>text</link>
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote />
    </document>
  </state>
)
