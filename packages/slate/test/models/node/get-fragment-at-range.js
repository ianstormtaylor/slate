/** @jsx h */

import h from '../../helpers/h'
import assert from 'assert'

export default function() {
  const value = (
    <value>
      <document>
        <paragraph>
          one <anchor />two<focus /> three
        </paragraph>
      </document>
    </value>
  )

  const { document, selection } = value
  const actual = document.getFragmentAtRange(selection)
  const expected = (
    <document>
      <paragraph>two</paragraph>
    </document>
  )

  const a = actual.toJSON()
  const e = expected.toJSON()
  assert.deepEqual(a, e)
}
