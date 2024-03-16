# Enabling Collaborative Editing

A common use case for text editors is collaborative editing, and the Slate editor was designed with this in
mind. You can enable multiplayer editing with [Yjs](https://github.com/yjs/yjs), a network-agnostic CRDT implementation
that allows you to share data among connected users. Because Yjs is network-agnostic, each project requires
a [communication provider](https://github.com/yjs/yjs#providers) set up on the back end to link users together.

In this guide, we'll show you how to set up a collaborative Slate editor using a Yjs provider. We'll also be
adding [slate-yjs](https://github.com/BitPhinix/slate-yjs) which allows you to add multiplayer features to Slate, such
as live cursors.

Let's start with a basic editor:

```jsx
import { Slate } from 'slate-react'

const initialValue = {
  children: [{ text: '' }],
}

export const CollaborativeEditor = () => {
  return <SlateEditor />
}

const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
```

Yjs is network-agnostic, which means each Yjs provider is set up in a slightly different way. For
example [@liveblocks/yjs](https://liveblocks.io/docs/api-reference/liveblocks-yjs) is
fully-hosted, whereas others such as [y-websocket](https://github.com/yjs/y-websocket) require you to host your own
WebSocket server. Because of this, we'll use code snippets that work for each provider, without going into too much
detail about setting up the provider itself.

This is how to connect to a collaborative Yjs document, ready to be used in your Slate editor.

```jsx
import { useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import * as Y from 'yjs'

const initialValue = {
  children: [{ text: '' }],
}

export const CollaborativeEditor = () => {
  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState()
  const [provider, setProvider] = useState()

  // Set up your Yjs provider and document
  useEffect(() => {
    const yDoc = new Y.Doc()
    const sharedDoc = yDoc.get('slate', Y.XmlText)

    // Set up your Yjs provider. This line of code is different for each provider.
    const yProvider = new YjsProvider(/* ... */)

    yProvider.on('sync', setConnected)
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }, [])

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>
  }

  return <SlateEditor />
}

const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
```

After setting up your Yjs document like this, you can then link it your editor by passing down `sharedType`, which
contains the multiplayer text, and by using functions from `slate-yjs`. We're also passing down `provider` which will be
helpful later.

```jsx
import { useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withYjs, YjsEditor } from '@slate-yjs/core'
import * as Y from 'yjs'

const initialValue = {
  children: [{ text: '' }],
}

export const CollaborativeEditor = () => {
  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState()
  const [provider, setProvider] = useState()

  // Connect to your Yjs provider and document
  useEffect(() => {
    const yDoc = new Y.Doc()
    const sharedDoc = yDoc.get('slate', Y.XmlText)

    // Set up your Yjs provider. This line of code is different for each provider.
    const yProvider = new YjsProvider(/* ... */)

    yProvider.on('sync', setConnected)
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }, [])

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>
  }

  return <SlateEditor sharedType={sharedType} provider={provider} />
}

const SlateEditor = ({ sharedType, provider }) => {
  const editor = useMemo(() => {
    const e = withReact(withYjs(createEditor(), sharedType))

    // Ensure editor always has at least 1 valid child
    const { normalizeNode } = e
    e.normalizeNode = entry => {
      const [node] = entry

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry)
      }

      Transforms.insertNodes(editor, initialValue, { at: [0] })
    }

    return e
  }, [])

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}
```

That's all you need to attach Yjs to Slate!

Let's look at a real-world example of setting up Yjs—here's a code snippet for setting up
a [Liveblocks provider](https://liveblocks.io/docs/get-started/yjs-slate-react). Liveblocks uses the concept of rooms,
spaces where users can
collaborative. To use a Liveblocks provider, you join a multiplayer room with `RoomProvider`, then pass the room
to `new LiveblocksProvider`, along with the Yjs document.

```jsx
import LiveblocksProvider from '@liveblocks/yjs'
import { RoomProvider, useRoom } from '../liveblocks.config'

// Join a Liveblocks room and show the editor after connecting
export const App = () => {
  return (
    <RoomProvider id="my-room-name" initialPresence={{}}>
      <ClientSideSuspense fallback={<div>Loading…</div>}>
        {() => <CollaborativeEditor />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

export const CollaborativeEditor = () => {
  const room = useRoom()
  const [connected, setConnected] = useState(false)
  const [sharedType, setSharedType] = useState()
  const [provider, setProvider] = useState()

  // Connect to your Yjs provider and document
  useEffect(() => {
    const yDoc = new Y.Doc()
    const sharedDoc = yDoc.get('slate', Y.XmlText)

    // Set up your Liveblocks provider with the current room and document
    const yProvider = new LiveblocksProvider(room, yDoc)

    yProvider.on('sync', setConnected)
    setSharedType(sharedDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.off('sync', setConnected)
      yProvider?.destroy()
    }
  }, [room])

  if (!connected || !sharedType || !provider) {
    return <div>Loading…</div>
  }

  return <SlateEditor sharedType={sharedType} provider={provider} />
}

const SlateEditor = ({ sharedType, provider }) => {
  // ...
}
```

Unlike other providers, Liveblocks hosts your Yjs back end for you, which means you don't need to run your own server
to get this working. For more information on setting up Liveblocks providers, make sure to read
their [Slate getting started](https://liveblocks.io/docs/get-started/yjs-slate-react) guide.

> Note that Liveblocks is independent of the Slate project, and isn't required for collaboration, but it may be
> convenient depending on your needs. [Other providers](https://github.com/yjs/yjs#providers) are available
> should you wish to set up and host a Yjs back end yourself.

After setting up Yjs, it's possible to add multiplayer cursors to your app. You can do this with hooks supplied by
[slate-yjs](), which allow you to find the cursor positions of other users. Here's an example of setting up a cursor
component.

```jsx
import {
  CursorOverlayData,
  useRemoteCursorOverlayPositions,
} from '@slate-yjs/react'
import { useRef } from 'react'

export function Cursors({ children }) {
  const containerRef = useRef(null)
  const [cursors] = useRemoteCursorOverlayPositions({ containerRef })

  return (
    <div className="cursors" ref={containerRef}>
      {children}
      {cursors.map(cursor => (
        <Selection key={cursor.clientId} {...cursor} />
      ))}
    </div>
  )
}

function Selection({ data, selectionRects, caretPosition }) {
  if (!data) {
    return null
  }

  const selectionStyle = {
    backgroundColor: data.color,
  }

  return (
    <>
      {selectionRects.map((position, i) => (
        <div
          style={{ ...selectionStyle, ...position }}
          className="selection"
          key={i}
        />
      ))}
      {caretPosition && <Caret caretPosition={caretPosition} data={data} />}
    </>
  )
}

function Caret({ caretPosition, data }) {
  const caretStyle = {
    ...caretPosition,
    background: data?.color,
  }

  const labelStyle = {
    transform: 'translateY(-100%)',
    background: data?.color,
  }

  return (
    <div style={caretStyle} className="caretMarker">
      <div className="caret" style={labelStyle}>
        {data?.name}
      </div>
    </div>
  )
}
```

With some matching styles to set up the positioning:

```css
.cursors {
  position: relative;
}

.caretMarker {
  position: absolute;
  width: 2px;
}

.caret {
  position: absolute;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
  top: 0;
  border-radius: 6px;
  border-bottom-left-radius: 0;
  padding: 2px 6px;
  pointer-events: none;
}

.selection {
  position: absolute;
  pointer-events: none;
  opacity: 0.2;
}
```

You can then import this into your `SlateEditor` component. Notice that we're using `withCursors` from `slate-yjs`,
adding `provider.awareness` and the current user's name to it. We're then wrapping `<Editable>` in the new `<Cursors>`
component we've just created.

```jsx
import { useEffect, useMemo, useState } from 'react'
import { createEditor, Editor, Transforms } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'
import { withCursors, withYjs, YjsEditor } from '@slate-yjs/core'
import { Cursors } from './Cursors'
import * as Y from 'yjs'

export const CollaborativeEditor = () => {
  // ...
}

const SlateEditor = ({ sharedType, provider }) => {
  const editor = useMemo(() => {
    const e = withReact(
      withCursors(withYjs(createEditor(), sharedType), provider.awareness, {
        // The current user's name and color
        data: {
          name: 'Chris',
          color: '#00ff00',
        },
      })
    )

    // Ensure editor always has at least 1 valid child
    const { normalizeNode } = e
    e.normalizeNode = entry => {
      const [node] = entry

      if (!Editor.isEditor(node) || node.children.length > 0) {
        return normalizeNode(entry)
      }

      Transforms.insertNodes(editor, initialValue, { at: [0] })
    }

    return e
  }, [])

  useEffect(() => {
    YjsEditor.connect(editor)
    return () => YjsEditor.disconnect(editor)
  }, [editor])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Cursors>
        <Editable />
      </Cursors>
    </Slate>
  )
}
```

You should now be seeing multiplayer cursors! To learn more, make sure to read
the [slate-yjs documentation](https://docs.slate-yjs.dev/).
