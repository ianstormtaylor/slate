/** @jsx jsx */
import { Editor, Point } from 'slate'
import { ReactEditor } from '../../src/plugin/react-editor'
import { jsx } from 'slate-hyperscript'
import { DOMSelection, DOMNode } from '../../src/utils/dom'
import { mock } from 'jest-mock-extended'
import { Selection } from '../selection'

export const input = (
  <editor>
    <text>one</text>
    <text>two</text>
    <text>three</text>
  </editor>
)

export const selection = {}

export const test = (editor: ReactEditor) => {
  //ReactEditor.toSlateRange = jest.fn((editor: Editor, domRange: Range | StaticRange | Selection) => )

  // Create our mock for the function toSlateRange is dependent on
  const mockToSlatePoint = jest.fn()
    .mockReturnValueOnce({ path: [0], offset: 0 })
    .mockReturnValueOnce({ path: [0], offset: 2 })

  // replace implementation with mock
  ReactEditor.toSlatePoint = mockToSlatePoint

  // create a selection obj to copy the parameters from
  const selectionObj = mock<DOMSelection>()

  // create our mock selection object
  const mockSelection = {
    anchorNode: mock<DOMNode>(),
    anchorOffset: 0,
    focusNode: mock<DOMNode>(),
    focusOffset: 2,
    isCollapsed: false,
    ...selectionObj as Selection
  }

  return ReactEditor.toSlateRange(editor, mockSelection)
}

export const output = {
  anchor: { path: [0], offset: 0 },
  focus: { path: [0], offset: 2 }
}
