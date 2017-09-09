
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
        }
      }
    }
  ],
  defaultBlockType: {
    type: 'default',
    data: {
      thing: 'value'
    }
  }
}

export const input = `
<p>one</p>
<div>two</div>
`.trim()

export const output = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <default kind="block" data={{ thing: 'value' }}>
        two
      </default>
    </document>
  </state>
)
