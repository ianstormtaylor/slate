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
  <state>
    <document>
      <quote>
        <image />
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          <image />
        </paragraph>
      </quote>
    </document>
  </state>
)
