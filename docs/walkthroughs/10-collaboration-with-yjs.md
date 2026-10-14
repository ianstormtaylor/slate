# Collaboration with Yjs

The [collaboration example](https://www.slatejs.org/examples/collaboration) shows two editors sharing one document without a server. You can also open the example in another tab of the same browser. It uses `@slate-yjs/core` to bind Slate to Yjs and `BroadcastChannel` to exchange Yjs updates between tabs on the same origin. The document lasts while a tab is open; it is not saved.

## What synchronizes

Each editor has its own Slate value, selection, history and `Y.Doc`. Its binding points to the `Y.XmlText` named `content` in that document. The binding translates local Slate operations into Yjs changes and applies incoming Yjs changes to Slate. Sending the whole Slate value after every keystroke would overwrite edits made elsewhere; exchanging Yjs updates lets Yjs merge changes instead.

Each editor opens its own `BroadcastChannel` with the same name, so updates reach the other editor on the page as well as editors in other tabs. On opening, it asks the others for their current state, then exchanges subsequent updates. Updates received from the channel use the channel as their transaction origin, so they are not broadcast again. This transport works within the same browser and origin; it does not connect different browsers or devices.

The example initializes every document from an identical template update containing one empty paragraph. Only the temporary template has a fixed client ID; each editable document keeps its randomly generated ID. This lets a new tab merge the same starting paragraph instead of inserting a second independent paragraph. In an application, load an existing shared document or initialize it once, rather than having each client independently insert the initial content.

## Plugin order and lifecycle

Create the plugins from the inside out:

```tsx
const editor = withReact(withYHistory(withYjs(createEditor(), sharedType)))
```

`withYjs` installs the operation binding first. `withYHistory` adds history based on those Yjs transactions. `withReact` adapts the resulting editor to React and the DOM. Call `YjsEditor.connect(editor)` after mounting the Slate provider and `YjsEditor.disconnect(editor)` on cleanup. The shared Yjs document supplies the connected editor's content; `Slate`'s `initialValue` is not the synchronization mechanism.

Keep normalization consistent across clients. The example inserts an empty paragraph if deleting the whole document leaves the editor with no children. A production schema also needs every client to agree on how to normalize its elements.

## Undo

Use `withYHistory` instead of layering `withHistory` onto the collaborative editor. Its undo manager tracks each editor's local origin, so Alice's Undo reverses Alice's edits while retaining Bob's edits. Undo and redo produce shared changes and therefore update every connected view. The example exposes buttons for each editor and destroys each document and its undo manager when the example unmounts.

## What belongs outside Slate

Slate provides the document model, operations, transforms, normalization and React editing surface. It does not merge concurrent edits, host rooms, persist documents, authenticate users or distribute cursor presence. Here Yjs merges document changes, the binding translates them, and `BroadcastChannel` transports updates.

For collaboration across devices, replace the example's channel with a provider such as [y-websocket](https://github.com/yjs/y-websocket), [y-webrtc](https://github.com/yjs/y-webrtc) or a hosted provider. WebRTC providers typically still need signaling. Add storage, authorization and room boundaries for your application.

Remote cursors are separate from document synchronization. `@slate-yjs/react` provides cursor hooks. Separate documents give each participant a distinct client ID, but cursors still need an awareness transport, presence cleanup and selection rendering. This example omits that additional setup to focus on document synchronization. See the [collaborative editing guide](07-enabling-collaborative-editing.md) for a provider with awareness.

## Versions

The example pins `@slate-yjs/core` to `1.0.2` and `yjs` to `13.6.33`. The binding declares `slate >=0.70.0` and `yjs ^13.5.29`; this repo's Slate `0.136.0` and the pinned Yjs version satisfy those ranges. Those ranges are a compatibility declaration, not a claim that this example has tested every accepted version. The example tests cover this repo's current versions.

Read the [slate-yjs documentation](https://docs.slate-yjs.dev/) and [Yjs update API](https://docs.yjs.dev/api/document-updates) for the binding and transport APIs.
