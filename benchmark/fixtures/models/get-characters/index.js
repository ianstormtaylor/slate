
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state.document.getCharacters()
}

export function after() {
  __clear()
}

