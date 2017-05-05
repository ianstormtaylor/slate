
import { __clear } from '../../../../lib/utils/memoize'

export default function ({ state, range }) {
  state.document.getBlocksAtRange(range)
}

export function before(state) {
  return {
    state,
    range: state.selection.moveToRangeOf(state.document),
  }
}

export function after() {
  __clear()
}
