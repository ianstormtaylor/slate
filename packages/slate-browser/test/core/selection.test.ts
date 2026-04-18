import {
  isCollapsed,
  serializePoint,
  serializeRange,
} from '../../src/core/selection'

describe('selection helpers', () => {
  it('serializes a point with path and offset', () => {
    expect(
      serializePoint({
        path: [0, 1, 2],
        offset: 4,
      })
    ).toBe('0.1.2:4')
  })

  it('serializes a range with anchor and focus', () => {
    expect(
      serializeRange({
        anchor: { path: [0, 0], offset: 1 },
        focus: { path: [0, 0], offset: 3 },
      })
    ).toBe('0.0:1|0.0:3')
  })

  it('detects a collapsed range', () => {
    expect(
      isCollapsed({
        anchor: { path: [1, 0], offset: 2 },
        focus: { path: [1, 0], offset: 2 },
      })
    ).toBe(true)
  })
})
