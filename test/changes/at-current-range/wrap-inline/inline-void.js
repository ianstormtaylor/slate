/** @jsx h */

import h from '../../../helpers/h'

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
    .wrapInline({
      type: 'link'
    })

  assert.deepEqual(
    next.selection.toJS(),
    range.toJS()
  )
}

export const input = (
  <state>
    <document>
      <paragraph>
        <image></image>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>
          <image></image>
        </link>
      </paragraph>
    </document>
  </state>
)
