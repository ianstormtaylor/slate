
import assert from 'assert'
import { Mark } from '../../../../../..'

export default function (state) {
  const { startText, selection } = state
  const sel = selection.merge({
    marks: Mark.createSet([
        Mark.create({
            type: 'bold'
        })
    ])
  })

  const next = state
    .transform()
    .addMark('bold')
    .focus()
    .blur()
    .apply()

  assert.deepEqual(
    next.selection.toJS(),
    sel.toJS()
  )
}
