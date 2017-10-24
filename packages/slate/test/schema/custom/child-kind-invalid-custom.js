/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        { kinds: ['block'] },
      ],
      normalize: (change, reason, { child }) => {
        if (reason == 'child_kind_invalid') {
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
        text
      </quote>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <quote>
        <paragraph>
          text
        </paragraph>
      </quote>
    </document>
  </state>
)
