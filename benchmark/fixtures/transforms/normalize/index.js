
import SCHEMA from '../../../../lib/schemas/core'

export default function (state) {
  state
    .transform({ normalized: false })
    .normalize(SCHEMA)
    .apply()
}
