/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'

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

export default function({ document }) {
  return document.getNextBlock(PathUtils.create([1]))
}

export const output = <paragraph>three</paragraph>
