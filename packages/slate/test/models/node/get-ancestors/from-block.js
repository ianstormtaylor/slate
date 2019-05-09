/** @jsx h */

import h from '../../../helpers/h'
import { PathUtils } from 'slate'

export const input = (
  <value>
    <document data={{ k: 'a' }}>
      <paragraph k="b">one</paragraph>
      <paragraph k="c">
        <anchor />two<focus />
      </paragraph>
      <paragraph k="d">three</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  const parentPath = PathUtils.lift(selection.start.path)
  return document
    .getAncestors(parentPath)
    .toArray()
    .map(n => `${n.object}:${n.data.get('k')}`)
}

export const output = [`document:a`]
