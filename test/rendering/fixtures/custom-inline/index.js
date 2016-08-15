
import React from 'react'

function Link(props) {
  const href = props.node.data.get('href')
  return <a {...props.attributes} href={href}>{props.children}</a>
}

export const schema = {
  nodes: {
    link: Link
  }
}
