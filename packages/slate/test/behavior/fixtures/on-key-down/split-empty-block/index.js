
import Simulate from '../../../../helpers/simulate'

export default function (state, stack) {
  return Simulate.keyDown(stack, state, null, { key: 'enter' })
}
