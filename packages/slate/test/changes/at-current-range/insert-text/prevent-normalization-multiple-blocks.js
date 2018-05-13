/** @jsx h */

import h from '../../../helpers/h'

/*
 * This test makes sure there are no intermediate normalization
 * when calling replaceNodeByKey which calls removeNodeByKey and insertNodeByKey successively.
 */

export default function(change) {
  // Replacing <hashtag> by an empty text means the <link> is now empty
  // and empty inlines are removed, according to Slate's core schema.

  change.insertText('', [], {normalize: false})
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag><anchor />lorem</hashtag>
        </link>
      </paragraph>
      <paragraph>
        <link>
          <hashtag>lorem<focus /></hashtag>
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
          <hashtag></hashtag>
        </link>
        <link>
          <hashtag><cursor /></hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)