/** @jsx h */

import h from '../../helpers/h'

export const flags = { normalize: true }

export const schema = {
  blocks: {
    paragraph: {},
    item: {
      parent: { types: ['list'] },
      nodes: [{ objects: ['text'] }],
    },
    list: {},
  },
}

export const customChange = change => {
  // this change function and schema are designed such that if
  // validation takes place before both wrapBlock calls complete
  // the node gets deleted by the default schema
  // and causes a test failure
  let target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'item')
  target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'list')
}

export const input = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <list>
        <item />
      </list>
    </document>
  </value>
)
