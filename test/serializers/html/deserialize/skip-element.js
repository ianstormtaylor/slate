
/** @jsx sugar */

import sugar from '../../../helpers/sugar'

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
              kind: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
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
<p><img/></p>
<div><img/></div>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph>
        <image />
      </paragraph>
    </document>
  </state>
)
