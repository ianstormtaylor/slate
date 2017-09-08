
import { Mark } from '../../../..'

const BOLD = {
  fontWeight: 'bold'
}

function decorate(text, block) {
  let { characters } = text
  let second = characters.get(1)
  const mark = Mark.create({ type: 'bold' })
  const marks = second.marks.add(mark)
  second = second.merge({ marks })
  characters = characters.set(1, second)
  return characters
}

export const plugins = [{
  schema: {
    marks: {
      bold: BOLD
    },
    rules: [{
      match: () => true,
      decorate,
    }]
  }
}]
