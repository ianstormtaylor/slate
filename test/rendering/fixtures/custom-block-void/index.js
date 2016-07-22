
import { Void } from '../../../..'
import React from 'react'

function Image(props) {
  return (
    <Void {...props}>
      <img src={props.node.data.get('src')} />
    </Void>
  )
}

export function renderNode(node) {
  if (node.type == 'image') return Image
}
