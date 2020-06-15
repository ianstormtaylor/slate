/** @jsx h */

import h from '../../../helpers/h'
import { PathUtils } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
      <paragraph>three</paragraph>
      <paragraph>four</paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getClosestBlock(PathUtils.create([1]))
}

export const output = null
