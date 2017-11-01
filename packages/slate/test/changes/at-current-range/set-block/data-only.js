/** @jsx h */

import h from '../../../helpers/h'

import { Data } from '../../../..'


export default function (change) {
  change.setBlock({ data: Data.create({ thing: 'value' }) })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="value">
        <cursor />word
      </paragraph>
    </document>
  </value>
)
