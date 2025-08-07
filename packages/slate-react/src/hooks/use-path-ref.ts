import { useEffect, useMemo, useState } from 'react'
import { useSlateStatic } from './use-slate-static'
import { Editor, EditorPathRefOptions, Path } from 'slate'

export const usePathRef = (
  path: Path,
  options: Omit<EditorPathRefOptions, 'onChange'>
) => {
  const editor = useSlateStatic()
  const [, setCacheKey] = useState(0)

  const pathRef = useMemo(() => {
    if (path) {
      return Editor.pathRef(editor, path, {
        ...options,
        onChange: () => {
          setCacheKey(prev => prev + 1)
        },
      })
    }

    return {
      current: null,
      unref: () => {},
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path])

  useEffect(
    () => () => {
      pathRef.unref()
    },
    [pathRef]
  )

  return pathRef.current
}
