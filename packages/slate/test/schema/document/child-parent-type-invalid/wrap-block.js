/** @jsx h */

import h from '../../../helpers/h'

export const schema = {
  blocks: {
    list: {
      nodes: ['item'],
      defaults: {
        nodes: ['item'],
      }
    },
    item: {
      parent: ['list'],
      defaults: {
        parent: { kind: 'block', type: 'list' },
      }
    }
  }
}

export const input = (
  <state>
    <document>
      <item />
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <list>
        <item />
      </list>
    </document>
  </state>
)
