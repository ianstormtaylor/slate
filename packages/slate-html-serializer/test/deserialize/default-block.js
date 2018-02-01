/** @jsx h */

import h from '../helpers/h'

export const config = {
  rules: [
    {
      deserialize(el, next) {
        switch (el.tagName.toLowerCase()) {
          case 'p': {
            return {
              object: 'block',
              type: 'paragraph',
              nodes: next(el.childNodes),
            }
          }
        }
      },
    },
  ],
  defaultBlock: {
    type: 'default',
    data: {
      thing: 'value',
    },
  },
}

export const input = `
<p>one</p>
<div>two</div>
`.trim()

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <block type="default" data={{ thing: 'value' }}>
        two
      </block>
    </document>
  </value>
)
