
import SCHEMA from '../../../../lib/constants/schema'
import { __clear } from '../../../../lib/utils/memoize'

export default function (state) {
  state
    .transform({ normalized: false })
    .normalize(SCHEMA)
    .apply()
}

export function after() {
  __clear()
}
