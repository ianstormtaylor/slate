
import React from 'react'
import ReactDOM from 'react-dom/server'
import { Editor } from '../../../..'

export default function (state) {
  ReactDOM.renderToStaticMarkup(<Editor state={state} />)
}
