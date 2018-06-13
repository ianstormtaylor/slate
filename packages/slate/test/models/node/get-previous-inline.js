/** @jsx h */

import h from '../../helpers/h'
import assert from 'assert'

export default function() {
  const { document } = (
    <value>
      <document>
        <paragraph>
          <link>http://slate.com</link>
          <hashtag>#slate</hashtag>
          <comment>Tests!</comment>
        </paragraph>
      </document>
    </value>
  )

  const paragraph = document.nodes.first()
  const firstInline = paragraph.nodes.get(1)
  const secondInline = paragraph.nodes.get(3)
  const thirdInline = paragraph.nodes.get(5)

  assert.equal(document.getPreviousInline(firstInline.key), null)
  assert.equal(document.getPreviousInline(secondInline.key), firstInline)
  assert.equal(document.getPreviousInline(thirdInline.key), secondInline)
}
