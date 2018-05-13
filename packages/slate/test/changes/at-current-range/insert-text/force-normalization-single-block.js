/** @jsx h */

import h from '../../../helpers/h'

/*
 * This test makes sure a normalization happens on insertText when user requires it
 */

export default function(change) {
  // Replacing <hashtag> by an empty text means the <link> is now empty
  // and empty inlines are removed, according to Slate's core schema.

  change.insertText('', [], {normalize: true})
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
        <cursor />
      </paragraph>
    </document>
  </value>
)
