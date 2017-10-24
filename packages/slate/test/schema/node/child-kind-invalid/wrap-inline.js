/** @jsx h */

import h from '../../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: ['paragraph'],
      defaults: {
        nodes: ['paragraph'],
      }
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
      <quote>
        <paragraph>
          <link>text</link>
        </paragraph>
      </quote>
    </document>
  </state>
)
