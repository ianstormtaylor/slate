
import { Mark } from '../../../..'

const BOLD = {
  fontWeight: 'bold'
}

function decorator(text) {
  let { characters } = text
  let second = characters.get(1)
  let mark = Mark.create({ type: 'bold' })
  let marks = second.marks.add(mark)
  second = second.merge({ marks })
  characters = characters.set(1, second)
  return characters
}

export const schema = {
  nodes: {
    default: {
      decorator
    }
  },
  marks: {
    bold: BOLD
  }
}
