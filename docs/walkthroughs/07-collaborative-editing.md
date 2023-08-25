# Collaborative editing

A common use case for text editors is collaborative editing, and the Slate editor was designed with this in
mind. You can enable multiplayer editing with [Yjs](https://github.com/yjs/yjs), a network-agnostic CRDT implementation
that allows you to share data among connected users. Because Yjs is network-agnostic, each project requires
a [communication provider](https://github.com/yjs/yjs#providers) set up on the back end to link users together.

In this guide, we'll show you how to set up a collaborative Slate editor using the Liveblocks Yjs provider, a
fully-hosted back end provider for Yjs, and the easiest option to set up. We'll also be
using [slate-yjs](https://github.com/BitPhinix/slate-yjs) which allows you to add multiplayer features to Slate, such
as live cursors.

Let's start with a basic editor:

```jsx
const emptyNode = {
  children: [{ text: '' }],
}

export const CollaborativeEditor = () => {
  return <SlateEditor />
}

const SlateEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} initialValue={emptyNode}>
      <Editable />
    </Slate>
  )
}
```

The first step in adding collaboration is to install Liveblocks, Yjs, and slate-yjs into your project.

```text
yarn add @liveblocks/client @liveblocks/react @liveblocks/yjs yjs @slate-yjs/core @slate-yjs/react
```

Next, create a Liveblocks configuration file (`liveblocks.config.js`) with the following command—we'll be setting up the
connection here.

```text
npx create-liveblocks-app@latest --init --framework react
```

Inside this file, you can place your Liveblocks public API key. To get this key, sign up
to [Liveblocks](https://liveblocks.io), then navigate to the
[dashboard](https://liveblocks.io/dashboard). From the dashboard, create a new project, click on "API keys" at the left,
and copy your public key
into `createClient`.

```javascript
const client = createClient({
  publicApiKey: 'YOUR_LIVEBLOCKS_PUBLIC_KEY',
})
```

Before we add collaboration, we first need to join a Liveblocks room. To do this, export `RoomProvider`
from `liveblocks.config.js` and place it at the root of your app. `id` is the unique name of the current multiplayer
room, and `ClientSideSuspense` displays a `fallback` as the application connects.

```jsx
import { RoomProvider } from './liveblocks.config'
import { CollaborativeEditor } from './CollaborativeEditor'
import { ClientSideSuspense } from '@liveblocks/react'

export const App = () => {
  return (
    <RoomProvider id="my-room" initialPresence={{}}>
      <ClientSideSuspense fallback="Loading…">
        {() => <CollaborativeEditor />}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
```
