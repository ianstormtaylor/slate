
import { __clear } from '../../../../lib/utils/memoize'

export default function ({ state, text }) {
  state.document.getPath(text.key)
}

export function before(state) {
  const text = state.document.getLastText()
  __clear()
  return { state, text }
}

export function after() {
  __clear()
}

