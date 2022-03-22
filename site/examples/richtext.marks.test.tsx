/** @jsx jsx */

import { assertOutput, buildTestHarness } from 'slate-test-utils'
import RichTextEditor from './richtext'
import { jsx } from '../test-utils'
import { fireEvent } from '@testing-library/dom'

it('user triggers bold hotkey and types with a collapsed selection', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          potato
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [editor, { triggerKeyboardEvent, type }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  await triggerKeyboardEvent('mod+b')
  await type(' cucumbers')

  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>potato</htext>
        <htext bold>
          {' '}
          cucumbers
          <cursor />
        </htext>
      </hp>
    </editor>
  )
})

it('user triggers bold hotkey with an expanded selection and types', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          po
          <anchor />
          tat
          <focus />o
        </htext>
      </hp>
    </editor>
  )

  const [editor, { triggerKeyboardEvent, type }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  await triggerKeyboardEvent('mod+b')

  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>po</htext>
        <htext bold>
          <anchor />
          tat
          <focus />
        </htext>
        <htext>o</htext>
      </hp>
    </editor>
  )
})

it('user triggers bold over a selection with italic applied', async () => {
  const input = (
    <editor>
      <hp>
        <htext>po</htext>
        <htext italic>
          <anchor />
          tat
          <focus />
        </htext>
        <htext>o</htext>
      </hp>
    </editor>
  )

  const [editor, { triggerKeyboardEvent, type }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  await triggerKeyboardEvent('mod+b')

  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>po</htext>
        <htext bold italic>
          <anchor />
          tat
          <focus />
        </htext>
        <htext>o</htext>
      </hp>
    </editor>
  )
})

it('user triggers bold over a reversed selection with italic applied', async () => {
  const input = (
    <editor>
      <hp>
        <htext>po</htext>
        <htext italic>
          <focus />
          tat
          <anchor />
        </htext>
        <htext>o</htext>
      </hp>
    </editor>
  )

  const [editor, { triggerKeyboardEvent, type }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  await triggerKeyboardEvent('mod+b')

  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>po</htext>
        <htext bold italic>
          <focus />
          tat
          <anchor />
        </htext>
        <htext>o</htext>
      </hp>
    </editor>
  )
})

it('user clicks bold toolbar button with a collapsed selection and types', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          potato
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [editor, { type }, { getByTestId }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  const boldButton = getByTestId('bold')

  // Assert on the buttons in the UI too!
  // @ts-ignore
  expect(boldButton).toHaveAttribute('data-active', 'false')

  fireEvent.mouseDown(boldButton)

  await type('apples')

  // @ts-ignore
  expect(boldButton).toHaveAttribute('data-active', 'true')
  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>potato</htext>
        <htext bold>
          apples
          <cursor />
        </htext>
      </hp>
    </editor>
  )
})

it('user clicks bold, italic, and underline buttons and types', async () => {
  const input = (
    <editor>
      <hp>
        <htext>
          potato
          <cursor />
        </htext>
      </hp>
    </editor>
  )

  const [editor, { type }, { getByTestId }] = await buildTestHarness(
    RichTextEditor
  )({
    editor: input,
  })

  const boldButton = getByTestId('bold')
  const italicButton = getByTestId('italic')
  const underlineButton = getByTestId('underline')

  // Assert on the buttons in the UI too!
  expect(boldButton).toHaveAttribute('data-active', 'false')
  expect(italicButton).toHaveAttribute('data-active', 'false')
  expect(underlineButton).toHaveAttribute('data-active', 'false')

  fireEvent.mouseDown(boldButton)
  fireEvent.mouseDown(italicButton)
  fireEvent.mouseDown(underlineButton)

  await type('apples')

  expect(boldButton).toHaveAttribute('data-active', 'true')
  expect(italicButton).toHaveAttribute('data-active', 'true')
  expect(underlineButton).toHaveAttribute('data-active', 'true')

  assertOutput(
    editor,
    <editor>
      <hp>
        <htext>potato</htext>
        <htext bold italic underline>
          apples
          <cursor />
        </htext>
      </hp>
    </editor>
  )
})
