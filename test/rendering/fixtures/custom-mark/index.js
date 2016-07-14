
import React from 'react'

const BOLD = {
  fontWeight: 'bold'
}

export function renderMark(mark) {
  if (mark.type == 'bold') return BOLD
}
