/** @jsx h */

import h from '../../../helpers/h'

import { Data } from '../../../..'


export default function (change) {
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  change
    .select(range)
    .setInline({ data: Data.create({ thing: 'value' }) })

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>word</link>
      </paragraph>
    </document>
  </state>
)
