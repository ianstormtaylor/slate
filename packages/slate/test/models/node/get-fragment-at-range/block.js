/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />two<focus /> three
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getFragmentAtRange(selection)
}

export const output = (
  <document>
    <paragraph>two</paragraph>
  </document>
)
