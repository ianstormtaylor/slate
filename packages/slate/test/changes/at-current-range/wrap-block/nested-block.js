/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapBlock('quote')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <cursor />word
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <quote>
          <paragraph>
            <cursor />word
          </paragraph>
        </quote>
      </quote>
    </document>
  </value>
)
