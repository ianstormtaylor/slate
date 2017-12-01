/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { types: ['paragraph'] },
      ],
      normalize: (change, reason, { child }) => {
        if (reason == 'child_type_invalid') {
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
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <image />
        </paragraph>
      </quote>
    </document>
  </value>
)
