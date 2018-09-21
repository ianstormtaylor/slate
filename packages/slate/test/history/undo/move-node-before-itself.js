/** @jsx h */

import h from '../../helpers/h'

export default function(value) {
  const next = value.change().moveNodeByKey('h', 'a', 0).value
  const undo = next.change().undo().value
  return undo
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
