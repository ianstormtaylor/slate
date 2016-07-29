
import React from 'react'

const BOLD = {
  fontWeight: 'bold'
}

const ITALIC = (props => <i>{props.children}</i>)

export function renderMark(mark, marks) {
  if (mark.type == 'bold') return BOLD
  if (mark.type == 'italic') return ITALIC
}
