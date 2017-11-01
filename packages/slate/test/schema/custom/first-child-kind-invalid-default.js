/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: { kinds: ['text'] },
    }
  }
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote />
    </document>
  </value>
)
