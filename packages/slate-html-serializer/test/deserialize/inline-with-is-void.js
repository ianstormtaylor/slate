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
          case 'img': {
            return {
              object: 'inline',
              type: 'emoji',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
}

export const input = `
<p><img/></p>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </value>
)
