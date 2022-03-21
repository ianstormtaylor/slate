/** @jsx jsx */

import { jsx } from '../test-utils'

import { buildTestHarness, assertOutput } from 'slate-test-utils'
import RichTextEditor from './richtext'
import { Editor } from 'slate'
import { ReactEditor } from 'slate-react'
import { act, fireEvent } from '@testing-library/react'

it.only('user types into an empty editor', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [editor, { type }] = await buildTestHarness(RichTextEditor)({
    editor: input,
  })

  await type('banana')

  const output = ((
    <editor>
      <hp>
        <htext>
          banana
          <cursor />
        </htext>
      </hp>
    </editor>
  ) as unknown) as Editor

  assertOutput(editor, output)
})
