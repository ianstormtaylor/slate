
import { Editor } from '../../..'
import React from 'react'
import ReactDOM from 'react-dom'

export default function (state) {
  const div = document.createElement('div')
  const props = { state }
  ReactDOM.render(<Editor {...props} />, div)
}
