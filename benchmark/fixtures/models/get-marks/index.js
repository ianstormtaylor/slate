
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state.document.getMarks()
}

export function after() {
  __clear()
}
