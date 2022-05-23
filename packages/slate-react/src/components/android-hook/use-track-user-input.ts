import { useCallback, useRef } from 'react'
import { ReactEditor } from '../..'
import { useSlateStatic } from '../../hooks/use-slate-static'

export function useTrackUserInput() {
  const editor = useSlateStatic()
  const receivedUserInput = useRef<boolean>(false)
  const animationFrameRef = useRef<number | null>(null)
  const onUserInput = useCallback(() => {
    if (receivedUserInput.current === false) {
      const window = ReactEditor.getWindow(editor)

      receivedUserInput.current = true
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        receivedUserInput.current = false
        animationFrameRef.current = null
      })
    }
  }, [])

  return {
    receivedUserInput,
    onUserInput,
  }
}
