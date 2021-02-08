import { useCallback, useState } from 'react'

export function useRestoreDOM() {
  const [key, setKey] = useState(0)
  const restoreDOM = useCallback(() => setKey(value => value + 1), [])

  return {
    restoreDOM,
    attributes: { key },
  }
}
