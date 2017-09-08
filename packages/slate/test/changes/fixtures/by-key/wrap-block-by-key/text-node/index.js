
export default function (state) {
  return state
    .change()
    .wrapBlockByKey('key', 'quote')
    .state
}
