/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  const texts = document.getTexts();
  const first = texts.first();
  const second = texts.last();
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  });

  return state
    .change()
    .unwrapInlineAtRange(range, 'link')
}

export const input = (
  <state>
    <document>
      <x-paragraph>
        <x-link>Hello</x-link>
        <x-link>world!</x-link>
      </x-paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-paragraph>Hello world!</x-paragraph>
    </document>
  </state>
)
