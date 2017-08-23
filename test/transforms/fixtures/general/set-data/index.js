
export default function (state) {
  return state
    .transform()
    .setData({ key: 'value' })
    .apply()
    .state
}
