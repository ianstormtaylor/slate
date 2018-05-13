/** @jsx h */

import h from '../../../helpers/h'

/*
 * This test makes sure there normalization is not triggered when inserting with collasped selection
 */

export default function(change) {
  // Replacing <hashtag> by an empty text means the <link> is now empty
  // and empty inlines are removed if normalization, according to Slate's core schema.

  change.insertText('', [])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag key="a"><anchor />lorem<focus /></hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag key="a"><cursor /></hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)
