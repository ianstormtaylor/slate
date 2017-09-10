/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const { selection, document } = state
  const blocks = document.getBlocks()
  const range = selection.moveToRangeOf(blocks.first(), blocks.last())

  return state
    .change()
    .wrapBlockAtRange(range, 'bulleted-list')
}

export const input = (
  <state>
    <document>
      <list-item>
        <paragraph>word1</paragraph>
      </list-item>
      <list-item>
        <paragraph>word2</paragraph>
      </list-item>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <bulleted-list>
        <list-item>
          <paragraph>word1</paragraph>
        </list-item>
        <list-item>
          <paragraph>word2</paragraph>
        </list-item>
      </bulleted-list>
    </document>
  </state>
)
