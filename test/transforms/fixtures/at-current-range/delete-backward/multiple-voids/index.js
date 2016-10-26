
import assert from 'assert'

export default function (state) {
  const { document, selection } = state
  const texts = document.getTexts()
  const first = texts.first()
  const middle = texts.get(1)
  const last = texts.last()

  const firstSelection = selection.merge({
    anchorKey: first.key,
    anchorOffset: 1,
    focusKey: first.key,
    focusOffset: 1
  })
  const middleSelection = selection.merge({
    anchorKey: middle.key,
    anchorOffset: 1,
    focusKey: middle.key,
    focusOffset: 1
  })
  // Simulate user click the void block, so the offset is 0
  const lastSelection = selection.merge({
    anchorKey: last.key,
    anchorOffset: 0,
    focusKey: last.key,
    focusOffset: 0
  })

  // first backspace
  // test backspace an user-focused void block
  state = state
    .transform()
    .moveTo(lastSelection)
    .deleteBackward()
    .apply()

  assert.deepEqual(
    state.selection.toJS(),
    middleSelection.toJS()
  )

  // second backspace
  // test backspace an inserted void block like drop image
  state = state
    .transform()
    .deleteBackward()
    .apply()

  assert.deepEqual(
    state.selection.toJS(),
    firstSelection.toJS()
  )

  // third backspace
  // test backspace the only one inserted void block in document
  state = state
    .transform()
    .deleteBackward()
    .apply()

  return state
}
