/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {

  change
    .setNodeByKey(document.nodes.first().key, {
        data: { src: 'world.png' }
    })

    .change()
    .undo()
    .state
}

export const input = (
  <state>
    <document>
      <x-image src="hello.png"></x-image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <x-image src="hello.png"></x-image>
    </document>
  </state>
)
