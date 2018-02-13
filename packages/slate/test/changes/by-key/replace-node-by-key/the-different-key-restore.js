/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { startBlock } = change.value
  const nextBlock = startBlock
    .merge({
      type: 'quote',
    })
    .mapDescendants(n => n.regenerateKey())
    .regenerateKey()
  change.replaceNodeByKey(startBlock.key, nextBlock)
}

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph key="a">
        t<cursor />wo
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <quote>
        t<cursor />wo
      </quote>
    </document>
  </value>
)
