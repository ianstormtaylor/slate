
import Simulate from '../../../../helpers/simulate'
import { Selection } from '../../../../..'

export default function (state, stack) {
  const selection = Selection.create({
    anchorKey: 'c',
    anchorOffset: 1,
    focusKey: 'c',
    focusOffset: 1,
    isFocused: true,
  })

  return Simulate.select(stack, state, null, { selection })
}
