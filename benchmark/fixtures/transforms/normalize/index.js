
import SCHEMA from '../../../../lib/schemas/core'

export default function (state) {
  state
    .change()
    .normalize(SCHEMA)
}
