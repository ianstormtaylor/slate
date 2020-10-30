/** @jsx jsx */
import { ReactEditor } from '../../src/plugin/react-editor'
import { DOMSelection, DOMNode, SlateRangeDescription } from '../../src/utils/dom'
import { mock } from 'jest-mock-extended'

const mockNode1 = mock<DOMNode>()

export const selection = {
  anchorNode: mockNode1,
  anchorOffset: 0,
  focusNode: mockNode1,
  focusOffset: 2,
  isCollapsed: false,
}

export const test = (inputSelection: DOMSelection) => {
  // Create our mocks for the functions toSlateRange is dependent on
  const mockToSlatePoint = jest.fn()
    .mockReturnValueOnce({ path: [0], offset: 0 })
    .mockReturnValueOnce({ path: [0], offset: 2 })

  const mockDomRangeToSlateRangeDescription = jest.fn()
    .mockReturnValue(inputSelection) // Our input will already be in the form we are expecting

  const mockEditor = mock<ReactEditor>()

  // replace dependancies with mocked implementations
  ReactEditor.toSlatePoint = mockToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = mockDomRangeToSlateRangeDescription

  return ReactEditor.toSlateRange(mockEditor, inputSelection)
}

export const output = {
  anchor: { path: [0], offset: 0 },
  focus: { path: [0], offset: 2 }
}
