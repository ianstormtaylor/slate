/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertFragment((
    <document>
      <quote>
        one
      </quote>
      <quote>
        two
      </quote>
      <quote>
        three
      </quote>
    </document>
  ))
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

// TODO: this output selection should be at the end of the block
export const output = (
  <value>
    <document>
      <paragraph>
        wordone
      </paragraph>
      <quote>
        two
      </quote>
      <quote>
        <cursor />three
      </quote>
    </document>
  </value>
)
