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

const oldDocument = document.setIn(['nodes', 0, 'nodes', 0], <paragraph />)

export default function() {
  return findClosestDifference(oldDocument, document)
}

export const output = document.nodes.first().nodes.first()
