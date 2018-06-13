/** @jsx h */

import h from '../../../helpers/h'
import { Data } from '../../../../src'

export default function(change) {
  change.setInlines({ data: Data.create({ thing: 'value' }) })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />word
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link thing="value">
          <cursor />word
        </link>
      </paragraph>
    </document>
  </value>
)
