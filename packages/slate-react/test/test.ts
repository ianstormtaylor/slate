import { fixtures } from '../../../support/fixtures'
import { ReactEditor } from '../src/plugin/react-editor'
import { DOMSelection, DOMNode, SlateRangeDescription } from '../src/utils/dom'
import { SlateRange } from 'slate'
import { mock } from 'jest-mock-extended'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    // Arrange
    let { selection, slateRangeSelection, output } = module

    // Act
    const result = testToSlateRange(selection, slateRangeSelection)

    // Assert
    expect(result).toEqual(output)
  })
})

const testToSlateRange = (inputSelection: DOMSelection, inputSlateRangeSelection: SlateRange) => {
  // Create our mocks for the functions toSlateRange is dependent on
  const mockToSlatePoint = jest.fn()
    .mockReturnValueOnce(inputSlateRangeSelection.anchor)
    .mockReturnValueOnce(inputSlateRangeSelection.focus)

  const mockDomRangeToSlateRangeDescription = jest.fn()
    .mockReturnValue(inputSelection) // Our input will already be in the form we are expecting

  const mockEditor = mock<ReactEditor>()

  // replace dependancies with mocked implementations
  ReactEditor.toSlatePoint = mockToSlatePoint
  ReactEditor.domRangeToSlateRangeDescription = mockDomRangeToSlateRangeDescription

  return ReactEditor.toSlateRange(mockEditor, inputSelection)
}
