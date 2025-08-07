import { useRef, useState } from 'react'
import { useSlateStatic } from './use-slate-static'
import { Editor, EditorPathRefOptions, Path, PathRef } from 'slate'

export const usePathRef = (
  path: Path,
  options: Omit<EditorPathRefOptions, 'onChange'>
) => {
  const editor = useSlateStatic()
  const [, setCacheKey] = useState(0)
  const prevPath = useRef<Path | null>(null)
  const pathRef = useRef<PathRef | null>(null)
  const isComparable = Boolean(prevPath.current && path)

  if (
    isComparable
      ? !Path.equals(prevPath.current, path)
      : prevPath.current !== path
  ) {
    prevPath.current = path

    pathRef.current?.unref()

    pathRef.current = Editor.pathRef(editor, path, {
      ...options,
      onChange: () => {
        setCacheKey(prev => prev + 1)
      },
    })

    setCacheKey(prev => prev + 1)
  }

  return pathRef.current.current
}
