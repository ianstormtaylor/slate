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
          case 'br': {
            return {
              object: 'inline',
              type: 'linebreak',
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p><strong>one<br/>two</strong></p>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>
        <text>
          <b>one</b>
        </text>
        <linebreak />
        <text>
          <b>two</b>
        </text>
      </paragraph>
    </document>
  </value>
)
