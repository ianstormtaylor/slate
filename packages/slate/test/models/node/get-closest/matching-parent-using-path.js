/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote key="a" {...{ className: 'slate-node' }}>
        <paragraph key="b" {...{ className: 'slate-node' }}>
          <text key="c">one</text>
        </paragraph>
      </quote>
      <paragraph key="d" {...{ className: 'slate-node' }}>
        <text key="e">two</text>
      </paragraph>
      <paragraph key="f" {...{ className: 'slate-node' }}>
        <inline type="link" key="g" {...{ className: 'slate-node' }}>
          <text key="h">three</text>
        </inline>
        <text key="i">four</text>
      </paragraph>
    </document>
  </value>
)

export default function({ document }) {
  return document.getClosest(
    [0, 0],
    n => n.data && n.data.get('className') === 'slate-node'
  )
}

export const output = (
  <paragraph key="b" {...{ className: 'slate-node' }}>
    <text key="c">one</text>
  </paragraph>
)
