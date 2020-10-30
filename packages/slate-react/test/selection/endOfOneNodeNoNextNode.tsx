/** @jsx jsx */
import { DOMNode, SlateRangeDescription } from '../../src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'

const anchorNode = mock<DOMNode>()
anchorNode.nodeValue = 'length' // length of 6

// It appears it is not possible to mock a `Selection`, so we will instead mock the parts of the code that
// Handle selections. This is not as high coverage, but at least we can test the behavior after getting a selection.
export const selection: SlateRangeDescription = {
  anchorNode,
  anchorOffset: 6,
  focusNode: anchorNode,
  focusOffset: 6,
  isCollapsed: false, // shouldn't be possible, but here for branch coverage.
}

// Here, we are mocking the output of the 'Editor.toSlatePoint` return from inside `Editor.toSlateRange`
export const slateRangeSelection: SlateRange = {
  anchor: { path: [0], offset: 6 },
  focus: { path: [0], offset: 6 },
}

// No next node
export const nextNodeEntry = undefined

// expect no change if there is no next node
export const output = {
  anchor: { path: [0], offset: 6 },
  focus: { path: [0], offset: 6 },
}
