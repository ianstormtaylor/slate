
/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        return {
          kind: 'block',
          type: 'paragraph',
        }
      }
    },
    {
      deserialize(el, next) {
        return {
          kind: 'block',
          type: 'quote',
        }
      }
    },
  ]
}

export const input = `
<p>one</p>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph />
    </document>
  </state>
)
