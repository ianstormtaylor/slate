/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  return value
    .change()
    .moveNodeByKey('h', 'a', 0)
    .value.change()
    .undo().value
}

export const input = (
  <value>
    <document key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">
        <paragraph key="d">two</paragraph>
        <paragraph key="e">
          <paragraph key="f">three</paragraph>
          <paragraph key="g">four</paragraph>
          <paragraph key="h">five</paragraph>
        </paragraph>
      </paragraph>
      <paragraph key="i">six</paragraph>
      <paragraph key="j">seven</paragraph>
    </document>
  </value>
)

export const output = input
