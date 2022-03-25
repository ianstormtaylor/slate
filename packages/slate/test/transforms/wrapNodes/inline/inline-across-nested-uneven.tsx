/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'

export const run = editor => {
  Transforms.wrapNodes(editor, <inline a />, {
    split: true,
    match: Text.isText,
  })
}

export const input = (
  <editor>
    <block>
      <text />
      <inline>
        To
        <anchor />
        be
      </inline>
      <text>
        or <focus /> not to be
      </text>
    </block>
  </editor>
)

const desiredOutput = (
  <editor>
    <block>
      <text />
      <inline>To</inline>
      <text />
      <inline a>
        <anchor />
        be
      </inline>
      <text />
      <inline a>or</inline>
      <text>
        <focus />
        not to be
      </text>
    </block>
  </editor>
)

const actualOutput = (
  <editor>
    <block>
      <text />
      <inline a>
        <text />
        <inline>
          To
          <anchor />
          be
        </inline>
        {'or '}
        <focus />
      </inline>

      {' not to be'}
    </block>
  </editor>
)

export const output = actualOutput
