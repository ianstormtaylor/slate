
# Plugins

In Slate, all custom logic added to the editor is done via plugins. Plugins have complete control over the schema, the behaviors, and the rendering of the components of the editor. Slate encourages you to break up code into small, reusable modules that can be shared with others, and easily reasoned about.

_To learn more, check out the [Using Plugins guide](../walkthroughs/using-plugins.md), or the [Plugins reference](../reference/plugins/plugins.md)._


### The Core Plugin

The "core" plugin that ships with Slate is where the default editing behavior is kept. It performs actions like splitting the current block when `enter` is pressed, or inserting a string of text when the user pastes from their clipboard. But it stops short of anything opinionated, leaving that for userland plugins to add.

_To learn more, check out the [Core Plugin reference](../reference/plugins/core.md)._


### The Editor Plugin

Plugins are so central to Slate's architecture, that the properties of the [`<Editor>`](../reference/components/editor.md) that allow you to add custom functionality (eg. `onKeyDown` or `onPaste`) are actually implemented as a plugin too. All of those properties actually just create an implicitly, top-priority plugin that gets added at the beginning of the editor's plugin stack. But you'd never even know it!

_To learn more, check out the [`<Editor>` component reference](../reference/components/editor.md)._
