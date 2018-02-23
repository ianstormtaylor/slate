/** @jsx h */
/* eslint-disable react/jsx-key */

import React from 'react'
import ReactDOM from 'react-dom/server'
import h from '../../test/helpers/h'
import { Editor } from '../..'

export default function(value) {
  const el = React.createElement(Editor, { value })
  ReactDOM.renderToStaticMarkup(el)
}

export const input = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            <paragraph>
              This is editable <b>rich</b> text, <i>much</i> better than a
              textarea!
            </paragraph>
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
