
import React from 'react'

function Bold(props) {
  return <strong className={props.props.className}>{props.children}</strong>
}

export const schema = {
  marks: {
    bold: Bold
  }
}
export const props = {
  className: 'custom-classname'
}
