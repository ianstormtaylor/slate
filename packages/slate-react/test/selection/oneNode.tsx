/** @jsx jsx */
import { SlateRange } from 'slate'

// It appears it is not possible to mock a `Selection`, so we will instead mock the parts of the code that
// Handle selections. This is not as high coverage, but at least we can test the behavior after getting a selection.
// Here, we are mocking the output of the 'Editor.toSlatePoint` return.
export const slateRangeSelection: SlateRange = {
  anchor: { path: [0], offset: 0 },
  focus: { path: [0], offset: 2 }
}

export const output = {
  anchor: { path: [0], offset: 0 },
  focus: { path: [0], offset: 2 }
}
