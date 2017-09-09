
/** @jsx sugar */

import sugar from '../../../helpers/sugar'

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
          case 'a': {
            return {
              kind: 'inline',
              type: 'link',
              data: { thing: 'value' },
              nodes: next(el.childNodes),
            }
          }
        }
      }
    }
  ]
}

export const input = `
<p><a>one</a></p>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph>
        <link thing="value">
          one
        </link>
      </paragraph>
    </document>
  </state>
)
