/** @jsx h */

import findClosestDifference from '../../../src/utils/find-closest-difference'
import h from '../../helpers/h'

const { document } = (
  <value>
    <document>
      <quote>
        <paragraph />
      </quote>
      <quote>
        <paragraph />
      </quote>
    </document>
  </value>
)

const newDocument = document.deleteIn(['nodes', 0, 'nodes', 0])

export default function() {
  return findClosestDifference(document, newDocument)
}

export const output = newDocument.nodes.first()
