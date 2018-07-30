/** @jsx h */

import h from '../../helpers/h'

export const flags = {}

export const schema = {
  blocks: {
    paragraph: {},
    item: {
      parent: { type: 'list' },
      nodes: [
        {
          match: [{ object: 'text' }],
        },
      ],
    },
    list: {},
  },
}

export const customChange = change => {
  // see if we can break the expected validation sequence by toggling
  // the normalization option
  const target = change.value.document.nodes.get(0)
  change.wrapBlockByKey(target.key, 'item', { normalize: true })
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
    <document />
  </value>
)
