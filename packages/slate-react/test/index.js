import { fixtures } from '../../../support/fixtures'

describe('slate-react', () => {
  fixtures(__dirname, 'selection', ({ module }) => {
    // Arrange
    let { selection, test, output } = module

    // Act
    const result = test(selection)

    // Assert
    expect(result).toEqual(output)
  })
})
