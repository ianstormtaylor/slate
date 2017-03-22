
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state.document.getBlocks()
}

export function after() {
  __clear()
}
