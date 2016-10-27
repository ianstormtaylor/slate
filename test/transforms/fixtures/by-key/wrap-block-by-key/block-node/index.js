
export default function (state) {
  return state
    .transform()
    .wrapBlockByKey('key', 'quote')
    .apply()
}
