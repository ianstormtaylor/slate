
export default function (state) {
  return state
    .change()
    .setData({ thing: 'value' })
    .state
}
