
import React from 'react'

const BOLD = {
  fontWeight: 'bold'
}

const ITALIC = {
  fontStyle: 'italic'
}

const BOLD_ITALIC = {
  fontFamily: 'bold-italic'
}

export function renderMark(mark, marks) {
  if (
    marks.size > 1 &&
    marks.some(m => m.type == 'bold') &&
    marks.some(m => m.type == 'italic')
  ) {
    return BOLD_ITALIC
  }

  if (mark.type == 'bold') return BOLD
  if (mark.type == 'italic') return ITALIC
}
