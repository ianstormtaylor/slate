/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts()
  const third = texts.get(2)
  const range = selection.merge({
    anchorKey: third.key,
    anchorOffset: 0,
    focusKey: third.key,
    focusOffset: 0
  })

  change
    .select(range)
    .setInline({ type: 'code' })

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <hashtag>
          <link>word</link>
        </hashtag>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag>
          <code>word</code>
        </hashtag>
      </paragraph>
    </document>
  </state>
)
