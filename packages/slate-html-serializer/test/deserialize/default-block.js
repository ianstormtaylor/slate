
/** @jsx h */

import { h } from 'slate-core-test-helpers'

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
  defaultBlock: {
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
      <block type="default" data={{ thing: 'value' }}>
        two
      </block>
    </document>
  </state>
)
