
import React from 'react'

function BOLD(props) {
  return <strong>{props.children}</strong>
}

export function renderMark(mark) {
  if (mark.type == 'bold') return BOLD
}
