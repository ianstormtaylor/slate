
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const inline = document.assertPath([0, 1])

  const next = state
    .transform()
    .unwrapInlineByKey(inline.key, 'hashtag')
    .apply()

  return next
}
