
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const inline = document.assertPath([0, 1])

  const next = state
    .change()
    .unwrapInlineByKey(inline.key, 'hashtag')
    .state

  return next
}
