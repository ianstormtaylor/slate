
import React from 'react'
import { Mark } from '../../../..'

const BOLD = {
  fontWeight: 'bold'
}

export function renderMark(mark) {
  if (mark.type == 'bold') return BOLD
}

export function renderDecorations(text) {
  let { characters } = text
  let second = characters.get(1)
  let mark = Mark.create({ type: 'bold' })
  let marks = second.marks.add(mark)
  second = second.merge({ marks })
  characters = characters.set(1, second)
  return characters
}
