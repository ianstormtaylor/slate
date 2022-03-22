/** @jsx jsx */

import { assertOutput, buildTestHarness } from 'slate-test-utils'
import RichTextEditor from './richtext'
import { jsx } from '../test-utils'
import { fireEvent } from '@testing-library/dom'

it('user inserts an bulleted list with a few items', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [
    editor,
    { type, pressEnter, deleteBackward, triggerKeyboardEvent },
    { getByTestId },
  ] = await buildTestHarness(RichTextEditor)({
    editor: input,
  })

  // Click the unordered list button in the nav
  const unorderedList = getByTestId('bulleted-list')
  fireEvent.mouseDown(unorderedList)

  assertOutput(
    editor,
    <editor>
      <hbulletedlist>
        <hlistitem>
          <htext>
            <cursor />
          </htext>
        </hlistitem>
      </hbulletedlist>
    </editor>
  )

  await type('🥕')
  await deleteBackward()
  await type('Carrots')

  assertOutput(
    editor,
    <editor>
      <hbulletedlist>
        <hlistitem>
          <htext>
            Carrots
            <cursor />
          </htext>
        </hlistitem>
      </hbulletedlist>
    </editor>
  )

  await pressEnter()
  await triggerKeyboardEvent('mod+b')
  await type('Apples')

  assertOutput(
    editor,
    <editor>
      <hbulletedlist>
        <hlistitem>
          <htext>Carrots</htext>
        </hlistitem>
        <hlistitem>
          <htext bold>
            Apples
            <cursor />
          </htext>
        </hlistitem>
      </hbulletedlist>
    </editor>
  )

  await triggerKeyboardEvent('mod+b')
  await pressEnter()
  await type('Cherries')

  assertOutput(
    editor,
    <editor>
      <hbulletedlist>
        <hlistitem>
          <htext>Carrots</htext>
        </hlistitem>
        <hlistitem>
          <htext bold>Apples</htext>
        </hlistitem>
        <hlistitem>
          <htext>
            Cherries
            <cursor />
          </htext>
        </hlistitem>
      </hbulletedlist>
    </editor>
  )

  // Delete like the user would, one key press at a time
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()
  await deleteBackward()

  assertOutput(
    editor,
    <editor>
      <hbulletedlist>
        <hlistitem>
          <htext>Carrots</htext>
        </hlistitem>
        <hlistitem>
          <htext bold>
            Apples
            <cursor />
          </htext>
        </hlistitem>
      </hbulletedlist>
    </editor>
  )
})
