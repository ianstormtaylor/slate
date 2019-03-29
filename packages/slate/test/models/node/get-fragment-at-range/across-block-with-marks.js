/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />
        <b>rd</b>
      </paragraph>
      <paragraph>
        <b>middle</b>
      </paragraph>
      <paragraph>
        <b>
          an<focus />other
        </b>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getFragmentAtRange(selection)
}

export const output = (
  <document>
    <paragraph>
      <b>rd</b>
    </paragraph>
    <paragraph>
      <b>middle</b>
    </paragraph>
    <paragraph>
      <b>an</b>
    </paragraph>
  </document>
)
