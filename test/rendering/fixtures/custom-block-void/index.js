
import React from 'react'

function Image(props) {
  return (
    <img src={props.node.data.get('src')} {...props.attributes} />
  )
}

export function renderNode(node) {
  if (node.type == 'image') return Image
}
