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
        one <link>two</link> three
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          one <link>two</link> three
        </paragraph>
      </quote>
    </document>
  </state>
)
