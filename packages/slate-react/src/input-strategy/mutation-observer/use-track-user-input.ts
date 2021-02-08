import { useCallback, useRef } from 'react'

export function useTrackUserInput() {
  const userInputRef = useRef<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)

  const handleUserInput = useCallback(() => {
    // Distinguish user input from other DOM mutations
    if (userInputRef.current === false) {
      userInputRef.current = true

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        userInputRef.current = false
        animationFrameRef.current = null
      })
    }
  }, [])

  return {
    userInput: userInputRef,
    attributes: { onKeyDown: handleUserInput },
  }
}
