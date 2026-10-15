import React, { useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import {
  slateNodesToInsertDelta,
  withYHistory,
  withYjs,
  YjsEditor,
} from '@slate-yjs/core'
import * as Y from 'yjs'

const initialValue = [{ type: 'paragraph', children: [{ text: '' }] }]
const createSharedDocument = () => {
  const template = new Y.Doc()
  template.clientID = 0
  template
    .get('content', Y.XmlText)
    .applyDelta(slateNodesToInsertDelta(initialValue))
  const document = new Y.Doc()
  Y.applyUpdate(document, Y.encodeStateAsUpdate(template))
  template.destroy()
  return document
}
const CollaborationExample = () => {
  const [documents, setDocuments] = useState([])
  useEffect(() => {
    const connections = ['Alice', 'Bob'].map(() => {
      const document = createSharedDocument()
      const channel = new BroadcastChannel('slate-collaboration-example')
      const publish = (update, origin) => {
        if (origin !== channel) channel.postMessage({ type: 'update', update })
      }
      channel.onmessage = ({ data }) => {
        if (data.type === 'request') {
          channel.postMessage({
            type: 'update',
            update: Y.encodeStateAsUpdate(document),
          })
        } else {
          Y.applyUpdate(document, data.update, channel)
        }
      }
      document.on('update', publish)
      channel.postMessage({ type: 'request' })
      return { document, channel, publish }
    })
    setDocuments(connections.map(({ document }) => document))
    return () => {
      connections.forEach(({ document, channel, publish }) => {
        document.off('update', publish)
        channel.close()
        document.destroy()
      })
    }
  }, [])
  return (
    <>
      <p>
        Edit either view of the shared document. Open this example in another
        tab to collaborate in the same browser. Closing every tab clears the
        document.
      </p>
      {documents.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}
        >
          <CollaborativeEditor document={documents[0]} name="Alice" />
          <CollaborativeEditor document={documents[1]} name="Bob" />
        </div>
      )}
    </>
  )
}
const CollaborativeEditor = ({ document, name }) => {
  const editor = useMemo(() => {
    const editor = withReact(
      withYHistory(withYjs(createEditor(), document.get('content', Y.XmlText)))
    )
    const { applyRemoteEvents } = editor
    editor.applyRemoteEvents = (events, origin) => {
      Editor.withRemoteChanges(editor, () => applyRemoteEvents(events, origin))
    }
    const { normalizeNode } = editor
    editor.normalizeNode = (entry, options) => {
      const [node] = entry
      if (Editor.isEditor(node) && node.children.length === 0) {
        Transforms.insertNodes(editor, initialValue, { at: [0] })
        return
      }
      normalizeNode(entry, options)
    }
    return editor
  }, [document])
  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])
  return (
    <section aria-label={`${name}'s editor`}>
      <h2>{name}</h2>
      <button
        onMouseDown={event => event.preventDefault()}
        onClick={editor.undo}
      >
        Undo {name}
      </button>{' '}
      <button
        onMouseDown={event => event.preventDefault()}
        onClick={editor.redo}
      >
        Redo {name}
      </button>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          aria-label={`${name}'s document`}
          placeholder="Type here..."
          style={{
            minHeight: '120px',
            padding: '12px',
            border: '1px solid #ddd',
          }}
        />
      </Slate>
    </section>
  )
}
export default CollaborationExample
