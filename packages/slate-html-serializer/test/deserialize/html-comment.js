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
        }
      },
    },
  ],
}

export const input = `
<!-- This comment should be ignored -->
<p>one</p>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
    </document>
  </value>
)
