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
  return document.getPreviousBlock(PathUtils.create([2]))
}

export const output = <paragraph>two</paragraph>
