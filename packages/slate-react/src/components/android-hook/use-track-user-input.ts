import { useCallback, useRef, useEffect } from 'react'
import { ReactEditor } from '../..'
import { useSlateStatic } from '../../hooks/use-slate-static'

export function useTrackUserInput() {
  const editor = useSlateStatic()

  const receivedUserInput = useRef<boolean>(false)
  const animationFrameIdRef = useRef<number>(0)

  const onUserInput = useCallback(() => {
    if (receivedUserInput.current) {
      return
    }

    receivedUserInput.current = true

    const window = ReactEditor.getWindow(editor)
    window.cancelAnimationFrame(animationFrameIdRef.current)

    animationFrameIdRef.current = window.requestAnimationFrame(() => {
      receivedUserInput.current = false
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(animationFrameIdRef.current), [])

  return {
    receivedUserInput,
    onUserInput,
  }
}
