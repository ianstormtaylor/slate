/** @jsx jsx */
import { DOMNode, SlateRangeDescription } from '../../src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'

const mockNode1 = mock<DOMNode>()
const mockNode2 = mock<DOMNode>()

// It appears it is not possible to mock a `Selection`, so we will instead mock the parts of the code that
// Handle selections. This is not as high coverage, but at least we can test the behavior after getting a selection.
export const selection: SlateRangeDescription = {
  anchorNode: mockNode1,
  anchorOffset: 4,
  focusNode: mockNode2,
  focusOffset: 1,
  isCollapsed: false,
}

// Here, we are mocking the output of the 'Editor.toSlatePoint` return from inside `Editor.toSlateRange`
export const slateRangeSelection: SlateRange = {
  anchor: { path: [0], offset: 4 },
  focus: { path: [1], offset: 2 }
}

export const output = {
  anchor: { path: [1], offset: 0 },
  focus: { path: [1], offset: 2 }
}
