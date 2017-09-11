
/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'img': {
            return {
              kind: 'block',
              type: 'image',
              isVoid: true,
            }
          }
        }
      }
    }
  ]
}

export const input = `
<img/>
`.trim()

export const output = (
  <state>
    <document>
      <image />
    </document>
  </state>
)
