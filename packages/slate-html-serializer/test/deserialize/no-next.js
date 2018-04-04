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
              nodes: next(),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p>one</p>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
