/** @jsx h */
/* eslint-disable react/jsx-key */

import Html from '../..'
import React from 'react'
import h from '../../test/helpers/h'
import parse5 from 'parse5' // eslint-disable-line import/no-extraneous-dependencies

const html = new Html({
  parseHtml: parse5.parseFragment,
  rules: [
    {
      serialize(obj, children) {
        switch (obj.kind) {
          case 'block': {
            switch (obj.type) {
              case 'paragraph': return React.createElement('p', {}, children)
              case 'quote': return React.createElement('blockquote', {}, children)
            }
          }
          case 'mark': {
            switch (obj.type) {
              case 'bold': return React.createElement('strong', {}, children)
              case 'italic': return React.createElement('em', {}, children)
            }
          }
        }
      }
    }
  ]
})

export default function (state) {
  html.serialize(state)
}

export const input = (
  <state>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            This is editable <b>rich</b> text, <i>much</i> better than a textarea!
          </paragraph>
        </quote>
      ))}
    </document>
  </state>
)
