import { useCallback } from 'react'

const catchSlateFragment = /data-slate-fragment="(.+?)"/m

const useClipboard = () => {
  const getData = useCallback(
    (nativeDataTransfer: DataTransfer): DataTransfer => {
      if (!nativeDataTransfer.getData('application/x-slate-fragment')) {
        const htmlData = nativeDataTransfer.getData('text/html')
        const [, fragment] = htmlData.match(catchSlateFragment) || []
        if (fragment) {
          const clipboardData = new DataTransfer()
          nativeDataTransfer.types.forEach(type => {
            clipboardData.setData(type, nativeDataTransfer.getData(type))
          })
          clipboardData.setData('application/x-slate-fragment', fragment)
          return clipboardData
        }
      }
      return nativeDataTransfer
    },
    []
  )
  return { getData }
}

export default useClipboard
