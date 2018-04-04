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
          case 'blockquote': {
            return {
              object: 'block',
              type: 'quote',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<blockquote><p>one</p></blockquote>
`.trim()

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
    </document>
  </value>
)
