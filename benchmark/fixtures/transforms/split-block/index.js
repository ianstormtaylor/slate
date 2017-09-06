
export default function (state) {
  state
    .change()
    .splitBlock()
}

export function before(state) {
  return state
    .change()
    .select({
      anchorKey: '_cursor_',
      anchorOffset: 10,
      focusKey: '_cursor_',
      focusOffset: 10
    })
    .state
}
