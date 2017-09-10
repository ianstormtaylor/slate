/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <emoji><anchor />{' '}</emoji><focus />abc
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph><cursor />abc</paragraph>
    </document>
  </state>
)
