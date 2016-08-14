
import React from 'react'

function Bold(props) {
  return <strong>{props.children}</strong>
}

export const schema = {
  marks: {
    bold: Bold
  }
}
