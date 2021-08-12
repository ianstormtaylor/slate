import { useRef, useCallback } from 'react'

const useClipboard = () => {
  const clipboardDataRef = useRef<DataTransfer | null>(null)
  const setData = useCallback((nativeDataTransfer: DataTransfer): void => {
    const clipboard = clipboardDataRef.current || new DataTransfer()
    nativeDataTransfer.types.forEach(type => {
      clipboard.setData(type, nativeDataTransfer.getData(type))
    })
    clipboardDataRef.current = clipboard
  }, [])
  const getData = useCallback(
    (nativeDataTransfer: DataTransfer): DataTransfer => {
      if (clipboardDataRef.current) {
        const clipboardRef = clipboardDataRef.current
        const refPlain = clipboardRef.getData('text/plain')
        const nativePlain = nativeDataTransfer.getData('text/plain')
        if (nativePlain === refPlain) {
          /*
           * if the plain was same, assume the clipboard is still same
           */
          return clipboardDataRef.current
        }
      }
      clipboardDataRef.current = null
      return nativeDataTransfer
    },
    []
  )
  return { setData, getData }
}

export default useClipboard
