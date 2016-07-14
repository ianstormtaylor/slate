
import React from 'react'

function Code(props) {
  return <pre {...props.attributes}><code>{props.children}</code></pre>
}

export function renderNode(node) {
  if (node.type == 'code') return Code
}
