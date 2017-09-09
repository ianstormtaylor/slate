
import path from 'path'
import readMetadata from 'read-metadata'
import { Raw } from '../../../../../..'

export default function (state) {
  const file = path.resolve(__dirname, 'fragment.yaml')
  const raw = readMetadata.sync(file)
  const fragment = Raw.deserialize(raw, { terse: true }).document

  const { document } = state
  const end = document.nodes.size

  return state
    .change()
    .insertFragmentByKey(document.key, end, fragment)
    .state
}
