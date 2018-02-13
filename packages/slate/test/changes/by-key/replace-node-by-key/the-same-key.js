/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { startBlock, startText } = change.value
  const nextBlock = startBlock.merge({
    type: 'quote',
    nodes: startBlock.nodes.push(startText.regenerateKey()),
  })
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
      <quote key="a">
        t<cursor />wotwo
      </quote>
    </document>
  </value>
)
