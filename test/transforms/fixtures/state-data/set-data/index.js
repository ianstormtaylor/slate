
export default function (state) {
  const data = {
    key1: "value1",
    key2: "value2"
  }

  const next = state
    .transform()
    .setDataOperation(data)
    .apply()

  return next
}
