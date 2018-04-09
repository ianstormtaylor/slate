/** @jsx h */
/* eslint-disable react/jsx-key */

import Html from '../..'
import React from 'react'
import h from '../../test/helpers/h'
import { JSDOM } from 'jsdom' // eslint-disable-line import/no-extraneous-dependencies

const html = new Html({
  parseHtml: JSDOM.fragment,
  rules: [
    {
      serialize(obj, children) {
        switch (obj.object) {
          case 'block': {
            switch (obj.type) {
              case 'paragraph':
                return React.createElement('p', {}, children)
              case 'quote':
                return React.createElement('blockquote', {}, children)
            }
          }
          case 'mark': {
            switch (obj.type) {
              case 'bold':
                return React.createElement('strong', {}, children)
              case 'italic':
                return React.createElement('em', {}, children)
            }
          }
        }
      },
    },
  ],
})

export default function(state) {
  html.serialize(state)
}

export const input = (
  <value>
    <document>
      {Array.from(Array(10)).map(() => (
        <quote>
          <paragraph>
            This is editable <b>rich</b> text, <i>much</i> better than a
            textarea!
          </paragraph>
        </quote>
      ))}
    </document>
  </value>
)
