
import { __clear } from '../../../../lib/utils/memoize'

export default function ({ state, next }) {
  state.document.updateDescendant(next)
}

export function before(state) {
  const last = state.document.getLastText()
  const next = last.insertText(0, 'some text')
  return { state, next }
}

export function after() {
  __clear()
}

