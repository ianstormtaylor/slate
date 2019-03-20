/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote key="a">
        <quote key="b">
          <paragraph key="c">
            <text key="d">one</text>
          </paragraph>
          <paragraph key="e">
            <text key="f">
              <cursor />
              two
            </text>
          </paragraph>
        </quote>
      </quote>
      <paragraph key="g">
        <text key="h">three</text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document
    .getNodesAtRange(selection)
    .map(n => n.key)
    .toArray()
}

export const output = ['a', 'b', 'e', 'f']
