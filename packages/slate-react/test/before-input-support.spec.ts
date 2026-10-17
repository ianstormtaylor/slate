const loadSupport = (userAgent: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(
    window.navigator,
    'userAgent'
  )
  const prototype = InputEvent.prototype as { getTargetRanges?: unknown }
  const original = prototype.getTargetRanges
  Object.defineProperty(window.navigator, 'userAgent', {
    configurable: true,
    get: () => userAgent,
  })
  prototype.getTargetRanges = () => []

  try {
    let support: boolean | undefined
    jest.isolateModules(() => {
      support =
        require('../../slate-dom/src/utils/environment').HAS_BEFORE_INPUT_SUPPORT
    })
    return support
  } finally {
    prototype.getTargetRanges = original
    if (descriptor) {
      Object.defineProperty(window.navigator, 'userAgent', descriptor)
    } else {
      delete (window.navigator as { userAgent?: string }).userAgent
    }
  }
}

describe('native beforeinput support detection', () => {
  test('treats legacy desktop Chrome as unsupported', () => {
    expect(
      loadSupport(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
      )
    ).toBe(false)
  })

  test('treats current Chrome as supported', () => {
    expect(
      loadSupport(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
    ).toBe(true)
  })
})
