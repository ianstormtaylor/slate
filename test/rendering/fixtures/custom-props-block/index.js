
import React from 'react'

function Code(props) {
  return <pre {...props.attributes} className={props.props.className}><code>{props.children}</code></pre>
}

export const schema = {
  nodes: {
    code: Code
  }
}
export const props = {
  className: 'custom-classname'
}
