export function throttle(fn: () => void, ms: number) {
  let lastCall = Date.now() - 2 * ms
  let trailingId: ReturnType<typeof setTimeout>

  const invoke = () => {
    lastCall = Date.now()
    fn()
  }

  return () => {
    const now = Date.now()

    if (now - lastCall >= ms) {
      invoke()
      return
    }

    clearTimeout(trailingId)
    trailingId = setTimeout(invoke, lastCall - now + ms)
  }
}
