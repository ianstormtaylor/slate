import { useEffect, useMemo } from 'react'
import { ReactEditor } from '../plugin/react-editor'
import { createRestoreDomManager } from '../components/restore-dom/restore-dom-manager'

export const useCompositionDOM = (editor: ReactEditor) => {
  const compositionDOM = useMemo(() => {
    const manager = createRestoreDomManager(editor, { current: true })
    let observer: MutationObserver | null = null

    const clear = () => {
      observer?.disconnect()
      observer = null
      manager.clear()
    }

    const observe = () => {
      observer ??= new MutationObserver(manager.registerMutations)
      observer.observe(ReactEditor.toDOMNode(editor, editor), {
        childList: true,
        subtree: true,
      })
    }

    const track = (text: string | null) => {
      if (!observer && !text?.includes('\n')) return
      observe()
    }

    const pause = () => {
      if (!observer) return
      manager.registerMutations(observer.takeRecords())
      observer.disconnect()
    }

    const restore = () => {
      pause()
      manager.restoreDOM()
    }

    return { observe, track, pause, restore, clear }
  }, [editor])

  useEffect(() => () => compositionDOM.clear(), [compositionDOM])

  return compositionDOM
}
