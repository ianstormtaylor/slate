
import React from 'react'

function Image(props) {
  return (
    <img src={props.node.data.get('src')} {...props.attributes} />
  )
}

export const schema = {
  nodes: {
    image: Image
  }
}
