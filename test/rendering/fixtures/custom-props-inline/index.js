
import React from 'react'

function Link(props) {
  const href = props.node.data.get('href')
  return <a {...props.attributes} className={props.props.className} href={href}>{props.children}</a>
}

export const schema = {
  nodes: {
    link: Link
  }
}
export const props = {
  className: 'custom-classname'
}
