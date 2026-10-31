import { useEffect, useMemo } from 'react'
import { isDOMElement } from 'slate-dom'
import { ReactEditor } from '../plugin/react-editor'

const revertMutation = (mutation: MutationRecord) => {
  const { target } = mutation

  if (mutation.type === 'characterData') {
    target.nodeValue = mutation.oldValue
  } else if (mutation.type === 'attributes' && isDOMElement(target)) {
    const name = mutation.attributeName!
    if (mutation.oldValue === null) {
      target.removeAttribute(name)
    } else {
      target.setAttribute(name, mutation.oldValue)
    }
  } else {
    mutation.addedNodes.forEach(node => node.parentNode?.removeChild(node))
    mutation.removedNodes.forEach(node =>
      target.insertBefore(node, mutation.nextSibling)
    )
  }
}

export const useNativeFormatDOM = (editor: ReactEditor) => {
  const nativeFormatDOM = useMemo(() => {
    let delivered: MutationRecord[] = []
    let observer: MutationObserver | null = null

    const deliver = (mutations: MutationRecord[]) => {
      if (delivered.length === 0) {
        setTimeout(() => {
          delivered = []
        })
      }
      delivered.push(...mutations)
    }

    const observe = () => {
      observer ??= new MutationObserver(deliver)
      observer.observe(ReactEditor.toDOMNode(editor, editor), {
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true,
      })
    }

    const disconnect = () => {
      observer?.disconnect()
      delivered = []
    }

    const revert = () => {
      const mutations = [...delivered, ...(observer?.takeRecords() ?? [])]
      delivered = []
      mutations.reverse().forEach(revertMutation)
    }

    return { observe, disconnect, revert }
  }, [editor])

  useEffect(() => {
    nativeFormatDOM.observe()
    return nativeFormatDOM.disconnect
  }, [nativeFormatDOM])

  return nativeFormatDOM
}
