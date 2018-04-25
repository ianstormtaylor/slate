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
      {Array.from(Array(100)).map((i) => (
        <quote>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`a${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`a${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`b${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`b${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`c${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`c${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`d${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`d${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`e${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`e${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`f${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`f${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`g${i}`} /> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`g${i}`} /> blocks.
          </paragraph>
          <paragraph>
            A block with a <highlight>decoration</highlight>.
          </paragraph>
          <paragraph>
            This <highlightAnchor key={`h${i}`}/> highlight spans...
          </paragraph>
          <paragraph>
            ...two <highlightFocus key={`h${i}`} /> blocks.
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
