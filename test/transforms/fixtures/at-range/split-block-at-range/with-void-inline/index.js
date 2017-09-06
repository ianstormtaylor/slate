
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const { nodes } = document
  const second = nodes.first().nodes.get(2)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  })

  const next = state
    .transform()
    .splitBlockAtRange(range)
    .apply()

  return next
}
