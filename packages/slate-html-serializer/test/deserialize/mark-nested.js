
/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'p': {
            return {
              kind: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
          case 'strong': {
            return {
              kind: 'mark',
              type: 'bold',
              nodes: next(el.childNodes),
            }
          }
          case 'em': {
            return {
              kind: 'mark',
              type: 'italic',
              nodes: next(el.childNodes),
            }
          }
        }
      }
    }
  ]
}

export const input = `
<p>o<em>n<strong>e</strong></em></p>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph>
        o<i>n<b>e</b></i>
      </paragraph>
    </document>
  </state>
)
