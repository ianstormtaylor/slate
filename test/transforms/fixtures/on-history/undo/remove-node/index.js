
import assert from 'assert'

export default function (state) {
  const { selection } = state

  let next = state
    .transform()
    .removeNodeByKey('key1')
    .apply()

    .transform()
    .undo()
    .apply()

  return next
}
