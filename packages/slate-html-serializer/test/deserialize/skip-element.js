/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'div': {
            return null
          }
          case 'p': {
            return {
              object: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
          case 'img': {
            return {
              object: 'block',
              type: 'image',
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p><img/></p>
<div><img/></div>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>
        <image />
      </paragraph>
    </document>
  </value>
)
