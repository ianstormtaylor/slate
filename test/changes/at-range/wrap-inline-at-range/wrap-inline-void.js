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
    .wrapInlineAtRange(range, {
      type: 'link'
    })
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-image></x-image>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>
        <x-link>
          <x-image></x-image>
        </x-link>
      </x-paragraph>
    </document>
  </state>
)
