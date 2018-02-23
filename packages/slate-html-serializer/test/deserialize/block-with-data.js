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
              data: { thing: 'value' },
              nodes: next(el.childNodes),
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
      <paragraph thing="value">one</paragraph>
    </document>
  </value>
)
