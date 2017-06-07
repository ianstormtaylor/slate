
import assert from 'assert'

export default function (state) {
  const key1 = {
    a: 1,
    b: 2
  }

  const data = [
    [key1, "value1"],
    ["key2", "value2"]
  ]

  const next = state
    .transform()
    .setDataOperation(data)
    .apply()

  return next
}
