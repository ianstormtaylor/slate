
/** @jsx sugar */

import sugar from '../../../helpers/sugar'

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
