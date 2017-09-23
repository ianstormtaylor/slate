/** @jsx h */
/* eslint-disable react/jsx-key */

import Html from '../..'
import React from 'react'
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

export default function (string) {
  html.deserialize(string)
}

export const input = `
  <blockquote>
    <p>
      This is editable <strong>rich</strong> text, <em>much</em> better than a textarea!
    </p>
  </blockquote>
`.trim().repeat(10)
