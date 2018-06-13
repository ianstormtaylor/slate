/** @jsx h */

import h from '../../../helpers/h'

/*
 * This test makes sure there are no intermediate normalization
 * when calling replaceNodeByKey which calls removeNodeByKey and insertNodeByKey successively.
 */

export default function(change) {
  // Replacing <hashtag> by an empty text means the <link> is now empty
  // and empty inlines are removed, according to Slate's core schema.
  // If an intermediate normalization were to happen, the final normalization
  // would fail to find the node's parent and thus throw because that parent
  // has already been removed before (due to the intermediate normalization).
  change.replaceNodeByKey('a', { object: 'text', text: '' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag key="a">lorem</hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph />
    </document>
  </value>
)
