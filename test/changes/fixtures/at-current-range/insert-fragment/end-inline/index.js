
import assert from 'assert'
import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '../../../../../..'

export default function (state) {
  const file = path.resolve(__dirname, 'fragment.yaml')
  const raw = readMetadata.sync(file)
  const fragment = Raw.deserialize(raw, { terse: true }).document

  const { document, selection } = state
  const texts = document.getTexts()
  const second = texts.get(1)
  const range = selection.merge({
    anchorKey: second.key,
    anchorOffset: second.text.length,
    focusKey: second.key,
    focusOffset: second.text.length
  })

  const next = state
    .change()
    .select(range)
    .insertFragment(fragment)
    .state

  const last = next.document.getTexts().last()

  assert.deepEqual(
    next.selection.toJS(),
    range.merge({
      anchorKey: last.key,
      anchorOffset: last.text.length,
      focusKey: last.key,
      focusOffset: last.text.length
    }).toJS()
  )

  return next
}
