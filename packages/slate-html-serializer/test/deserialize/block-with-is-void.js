/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'img': {
            return {
              object: 'block',
              type: 'image',
              isVoid: true,
            }
          }
        }
      },
    },
  ],
}

export const input = `
<img/>
`.trim()

export const output = (
  <value>
    <document>
      <image />
    </document>
  </value>
)
