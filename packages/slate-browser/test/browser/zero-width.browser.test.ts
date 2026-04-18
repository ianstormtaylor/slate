import { expect, it } from 'vitest'

import { inspectZeroWidthPlaceholder } from '../../src/browser/zero-width'

it('reads a FEFF-backed zero-width placeholder shape in a real browser', () => {
  document.body.innerHTML =
    '<span data-slate-zero-width="n">\uFEFF<br /></span>'

  expect(
    inspectZeroWidthPlaceholder(
      document.querySelector('[data-slate-zero-width="n"]')
    )
  ).toEqual({
    hasBr: true,
    hasFEFF: true,
    kind: 'n',
  })
})

it('reads a line-break zero-width placeholder shape in a real browser', () => {
  document.body.innerHTML = '<span data-slate-zero-width="n"><br /></span>'

  expect(
    inspectZeroWidthPlaceholder(
      document.querySelector('[data-slate-zero-width="n"]')
    )
  ).toEqual({
    hasBr: true,
    hasFEFF: false,
    kind: 'n',
  })
})
