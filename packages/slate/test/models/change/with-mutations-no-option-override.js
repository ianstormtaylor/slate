/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    item: {
      parent: { types: ['list'] },
      nodes: [
        { objects: ['text'] }
      ]
    },
    list: {},
  }
}

export const customChange = (change) => {
  // see if we can break the expected validation sequence by toggling
  // the normalization option
  let target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'item', { normalize: true })
  target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'list', { normalize: false })
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