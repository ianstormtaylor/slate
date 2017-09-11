
/** @jsx h */

import h from '../../../helpers/h'

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
        }
      }
    }
  ]
}

export const input = `
<!-- This comment should be ignored -->
<p>one</p>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
    </document>
  </state>
)
