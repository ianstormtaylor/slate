
import { Editor } from '../../..'
import React from 'react'
import ReactDOM from 'react-dom'

export function before(state) {
  return state.transform()
    .select({
      anchorKey: '_cursor_',
      anchorOffset: 10,
      focusKey: '_cursor_',
      focusOffset: 10
    })
    .apply()
}

export default function (state) {
  const div = document.createElement('div')
  ReactDOM.render(<Editor state={state} />, div)
  state = state.transform().splitBlock().apply()
  ReactDOM.render(<Editor state={state} />, div)
}
