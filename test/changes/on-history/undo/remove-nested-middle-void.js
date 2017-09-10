/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  return state
    .change()
    .removeNodeByKey('bb')
    .removeNodeByKey('b')

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <x-figure>
        <x-image></x-image>
      </x-figure>
      <x-figure>
        <x-image></x-image>
      </x-figure>
      <x-figure>
        <x-image></x-image>
      </x-figure>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-figure>
        <x-image></x-image>
      </x-figure>
      <x-figure>
        <x-image></x-image>
      </x-figure>
      <x-figure>
        <x-image></x-image>
      </x-figure>
    </document>
  </state>
)
