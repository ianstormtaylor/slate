
import React from 'react'

const BOLD = {
  fontWeight: 'bold'
}

function ITALIC(props) {
  return <i>{props.children}</i>
}

export const schema = {
  marks: {
    bold: BOLD,
    italic: ITALIC
  }
}
