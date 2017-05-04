
import { __clear } from '../../../../lib/utils/memoize'

export default function ({ state, next }) {
  state.document.updateDescendant(next)
}

export function before(state) {
  const texts = state.document.getTexts()
  const { size } = texts
  const text = texts.get(Math.round(size / 2))
  const next = text.insertText(0, 'some text')
  __clear()
  return { state, next }
}

export function after() {
  __clear()
}

