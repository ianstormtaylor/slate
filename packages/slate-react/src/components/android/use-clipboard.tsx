import * as React from 'react'

const useClipboard = () => {
  const clipboardDataRef = React.useRef<DataTransfer | null>(null)
  const setData = (nativeDataTransfer: DataTransfer): void => {
    const clipboard = clipboardDataRef.current || new DataTransfer()
    nativeDataTransfer.types.forEach(type => {
      clipboard.setData(type, nativeDataTransfer.getData(type))
    })
    clipboardDataRef.current = clipboard
  }
  const getData = (nativeDataTransfer: DataTransfer): DataTransfer => {
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
  }
  return { setData, getData }
}

export default useClipboard
