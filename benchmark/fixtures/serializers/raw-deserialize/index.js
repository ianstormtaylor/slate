
import { Raw } from '../../../..'

export default function (json) {
  Raw.deserialize(json, { normalize: false })
}

export function before(state) {
  return Raw.serialize(state)
}
