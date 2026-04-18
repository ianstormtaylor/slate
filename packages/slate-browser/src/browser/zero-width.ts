export type PlaceholderShape = {
  hasBr: boolean
  hasFEFF: boolean
  kind: string | null
}

export const inspectZeroWidthPlaceholder = (
  element: Element | null
): PlaceholderShape => {
  if (!element) {
    return {
      hasBr: false,
      hasFEFF: false,
      kind: null,
    }
  }

  return {
    hasBr: !!element.querySelector('br'),
    hasFEFF: element.textContent?.includes('\uFEFF') ?? false,
    kind: element.getAttribute('data-slate-zero-width'),
  }
}
