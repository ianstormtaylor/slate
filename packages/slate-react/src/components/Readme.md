
This directory contains the React components that Slate renders. Here's what they all do:

- [Content](#content)
- [Editor](#editor)
- [Leaf](#leaf)
- [Placeholder](#placeholder)
- [Text](#text)
- [Void](#void)


#### Content

`Content` is rendered by the [`Editor`](#editor). Its goal is to encapsulate all of the `contenteditable` logic, so that the [`Editor`](#editor) doesn't have to be aware of it.

`Content` handles things attaching event listeners to the DOM and triggering updates based on events. However, it does not have any awareness of "plugins" as a concept, bubbling all of that logic up to the [`Editor`](#editor) itself.

You'll notice there are **no** `Block` or `Inline` components. That's because those rendering components are provided by the user, and rendered directly by the `Content` component. You can find the default renderers in the [`Core`](../plugins/core.js) plugin's logic.


#### Editor

The `Editor` is the highest-level component that you render from inside your application. Its goal is to present a very clean API for the user, and to encapsulate all of the plugin-level logic. 

Many of the properties passed into the editor are combined to create a plugin of its own, that is given the highest priority. This makes overriding core logic super simple, without having to write a separate plugin.


#### Leaf

The `Leaf` component is the lowest-level component in the React tree. Its goal is to encapsulate the logic that works at the lowest level, on the actual strings of text in the DOM.

One `Leaf` component is rendered for each range of text with a unique set of [`Marks`](../models#mark). It handles both applying the mark styles to the text, and translating the current [`Selection`](../models#selection) into a real DOM selection, since it knows about the string offsets.


#### Placeholder

A `Placeholder` component is just a convenience for rendering placeholders on top of empty nodes. It's used in the core plugin's default block renderer, but is also exposed to provide the convenient API for custom blocks as well.


#### Text

A `Text` component is rendered for each [`Text`](../models#text) model in the document tree. This component handles grouping the characters of the text node into ranges that have the same set of [`Marks`](../models#mark), and then delegates rendering each range to...


#### Void

The `Void` component is a wrapper that gets rendered around [`Block`](../models#block) and [`Inline`](../models#inline) nodes that have `isVoid: true`. Its goal is to encapsule the logic needed to ensure that void nodes function as expected.

To achieve this, `Void` renders a few extra elements that are required to keep selections and keyboard shortcuts on void nodes functioning like you'd expect them two. It also ensures that everything inside the void node is not editable, so that it doesn't get the editor into an unknown state.
