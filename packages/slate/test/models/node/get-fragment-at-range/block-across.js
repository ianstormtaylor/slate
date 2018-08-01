/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        on<anchor />e
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        th<focus /> ree
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getFragmentAtRange(selection)
}

export const output = (
  <document>
    <paragraph>e</paragraph>
    <paragraph>two</paragraph>
    <paragraph>th</paragraph>
  </document>
)
