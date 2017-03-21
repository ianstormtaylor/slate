
import SCHEMA from '../../../lib/constants/schema'

export default function (state) {
  state
    .transform({ normalized: false })
    .normalize(SCHEMA)
    .apply()
}
