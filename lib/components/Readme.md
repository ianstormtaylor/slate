
This directory contains the React components that Slate renders. The only one that is publicly accessible is the `Editor`, which composes the others.

#### Editor

The `Editor` is the highest-level component that you render from inside your application. It's goal is to present a very clean API for the user, and to encapsulate all of the "plugin-level" logic.

#### Content

`Content` is rendered by the `Editor`. It's goal is to encapsulate all of the `contenteditable` logic, so that the `Editor` doesn't have to be aware of it. Therefore, `Content` handles things attaching event listeners to the DOM and triggering updates based on events.

You'll notice there are **no** `Block` or `Inline` components here. That's because those rendering components are provided by the user, and rendered directly by the `Content` component. You can find the default renderers in the [`Core`](../plugins/core.js) plugin's logic.

#### Text

A `Text` component is rendered for each [`Text`](../models) model in the document tree. This component handles grouping the characters of the text node into ranges that have the same set of [`Marks`](../models), and then delegates rendering each range to...

#### Leaf

The `Leaf` component is the lowest-level component in the React tree. One is rendered for each range of text with a unique set of marks. It handles applying the mark styles to the text, and translating the current [`Selection`](../models) into a real DOM selection.
