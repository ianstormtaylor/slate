/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: { types: ['paragraph'] },
      normalize: (change, reason, { child }) => {
        if (reason == 'last_child_type_invalid') {
          change.wrapBlockByKey(child.key, 'paragraph')
        }
      }
    }
  }
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
        <paragraph>
          <image />
        </paragraph>
      </quote>
    </document>
  </value>
)
