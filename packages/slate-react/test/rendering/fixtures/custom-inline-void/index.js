
import React from 'react'

function Image(props) {
  return <img {...props.attributes} />
}

export const schema = {
  nodes: {
    image: Image
  }
}
