
import React from 'react'

function Link(props) {
  const href = props.node.data.get('href')
  return <a {...props.attributes} href={href}>{props.children}</a>
}

export function renderNode(node) {
  if (node.type == 'link') return Link
}
