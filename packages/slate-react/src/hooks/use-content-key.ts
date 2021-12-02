import { useEffect, useRef, useState } from 'react'
import { Node as SlateNode } from 'slate'
import { NODE_TO_RESTORE_DOM } from '../utils/weak-maps'

export function useContentKey(node: SlateNode) {
  const contentKeyRef = useRef<number>(0)
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const [, setForceRerenderCounter] = useState(0)

  useEffect(() => {
    NODE_TO_RESTORE_DOM.set(node, () => {
      // Only force a re-render if the component isn't re-rendered this tick in order
      // to avoid rendering it twice.
      updateTimeoutRef.current = setTimeout(() => {
        setForceRerenderCounter(state => state + 1)
        updateTimeoutRef.current = undefined
      }, 0)

      contentKeyRef.current++
    })

    return () => {
      NODE_TO_RESTORE_DOM.delete(node)
    }
  }, [node])

  useEffect(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
      updateTimeoutRef.current = undefined
    }
  })

  return contentKeyRef.current
}
