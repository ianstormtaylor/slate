
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state.document.getTexts()
}

export function after() {
  __clear()
}

