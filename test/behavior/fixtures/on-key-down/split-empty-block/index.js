
import simulate from '../../../../helpers/simulate'

export default function (state, editor) {
  simulate(editor, 'keyDown', 'enter')
}
