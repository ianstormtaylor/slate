/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertFragment(
    <document>
      <quote>fragment</quote>
    </document>
  )
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
        fragment<cursor />
        <link>word</link>
      </paragraph>
    </document>
  </value>
)

// The result has an invalid selection for now:
//
// "selection": {
//   "anchorOffset": 8
//   "anchorPath": [
//     0
//     1
//     0
//   ]
//   "focusOffset": 8
//   "focusPath": [
//     0
//     1
//     0
//   ]
export const skip = true
