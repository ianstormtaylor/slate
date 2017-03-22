
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state.document.getInlines()
}

export function after() {
  __clear()
}
