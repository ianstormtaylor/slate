/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor /><hashtag>or<focus /></hashtag>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>w<anchor />or<focus />d</paragraph>
    </document>
  </state>
)
