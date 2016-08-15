
import React from 'react'

function Code(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}

export const schema = {
  nodes: {
    code: Code
  }
}
