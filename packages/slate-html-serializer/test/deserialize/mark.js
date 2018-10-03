/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'p': {
            return {
              object: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
          case 'strong': {
            return {
              object: 'mark',
              type: 'bold',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p>on<strong>e</strong></p>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>
        <text>on</text>
        <text>
          <b>e</b>
        </text>
      </paragraph>
    </document>
  </value>
)
