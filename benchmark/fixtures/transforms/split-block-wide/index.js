
export default function (state) {
  state
    .transform()
    .splitBlock()
    .apply()
}

export function before(state) {
  return state
    .transform()
    .select({
      anchorKey: '_cursor_',
      anchorOffset: 10,
      focusKey: '_cursor_',
      focusOffset: 10
    })
    .apply()
}
