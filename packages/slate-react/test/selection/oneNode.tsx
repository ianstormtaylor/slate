/** @jsx jsx */
import { Editor, Point } from 'slate'
import { ReactEditor } from '../../src/plugin/react-editor'
import { DOMSelection, DOMNode, SlateRangeDescription } from '../../src/utils/dom'
import { mock } from 'jest-mock-extended'
import { Selection } from '../selection'

const mockNode1 = mock<DOMNode>()

export const input = {
  anchorNode: mockNode1,
  anchorOffset: 0,
  focusNode: mockNode1,
  focusOffset: 2,
  isCollapsed: false,
}

export const test = (editor: ReactEditor, input: DOMSelection) => {
  // Create our mocks for the functions toSlateRange is dependent on
  const mockToSlatePoint = jest.fn()
    .mockReturnValueOnce({ path: [0], offset: 0 })
    .mockReturnValueOnce({ path: [0], offset: 2 })

  const mockDomRangeToSlateRangeDescription = jest.fn()
    .mockReturnValueOnce(input) // Our input will already be in the form we are expecting

  // replace dependancies with mocked implementations
  ReactEditor.toSlatePoint = mockToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = mockDomRangeToSlateRangeDescription

  return ReactEditor.toSlateRange(editor, input)
}

export const output = {
  anchor: { path: [0], offset: 0 },
  focus: { path: [0], offset: 2 }
}
