# Plugins

With Slate, _all_ of your editor's logic is controlled by "plugins".

Plugins have complete control over the schema, the behaviors, and the rendering of the editor—they can add any kind of functionality they want. So much so that even the core logic of Slate is provided via two "core" plugins.

Slate encourages you to break up code into small, reusable modules that can be shared with others, and easily reasoned about.

## What Are Plugins?

Slate's plugins are simply a collection of functions that all contribute to a shared behavior—each with a specific name and set of arguments. For a full list of the arguments, check out the [`Plugins` reference](../slate-react/plugins.md).

Here's a really simple plugin:

```javascript
{
  onKeyDown(event, change, editor) {
    if (event.key == 'Escape') {
      change.blur()
    }
  },
  onClick(event, change, editor) {
    if (change.value.isBlurred) {
      change.selectAll().focus()
    }
  }  
}
```

It focuses the editor and selects everything when it is clicked, and it blurs the editor when esc is pressed.

Notice how it's able to define a set of behaviors that work together to form a single "feature" in the editor. That's what makes Slate's plugins a powerful form of encapsulation.

## The Plugins "Stack"

Slate's editor takes a list of plugins as one of its arguments. We refer to this list as the plugins "stack". It is very similar to "middleware" from Express or Koa.

```javascript
const plugins = [
  ...
]

<Editor
  plugins={plugins}
  ...
/>
```

When the editor needs to handle a DOM event, or decide what to render, it will loop through the plugins stack, invoking each plugin in turn. Plugins can choose to handle the request, in which case the editor will break out of the loop. Or they can ignore it, and they will be skipped as the editor proceeds to the next plugin in the stack.

Because of this looping, plugins are **order-sensitive**! This is very important. The earlier in the stack, the more preference the plugin has, since it can react before the others after it. If two plugins both try to handle the same event, the earlier plugin will "win".

## "Core" Plugins

If you put Slate on the page without adding any of your own plugins, it will still behave like you'd expect a rich-text editor to. That's because it has its own "core" logic. And that core logic is implemented with its own core plugins.

The core plugins doesn't have any assumptions about your schema, or what types of formatting you want to allow. But they do define common editing behaviors like splitting the current block when enter is pressed, or inserting a string of text when the user pastes from their clipboard.

These are behaviors that all rich-text editors exhibit, and that don't make sense for userland to have to re-invent for every new editor.

There are two core plugins: the "before plugin" and the "after plugin". They get their names because one of them is before all other plugins in the stack, and the other is after them.

For the most part you don't need to worry about the core plugins. The before plugin helps to pave over editing inconsistencies, and the after plugin serves as a fallback, to implement the default behavior in the event that your own plugins choose not to handle a specific event.

_To learn more, check out the _[_Core Plugin reference_](../slate-react/core-plugins.md)_._

## The "Editor" Plugin

If you've read through the [`<Editor>` reference](../slate-react/editor.md) you'll notice that the editor itself has handlers like `onKeyDown`, `onClick`, etc. just like plugins.

```javascript
const plugins = [
  ...
]

<Editor
  onClick={...}
  onKeyDown={...}
  plugins={plugins}
/>
```

This is nice because it makes simple cases easier, and nicely mimics the native DOM API of `<input>` and `<textarea>`.

But under the covers, those editor handlers are actually just a convenient way of writing a plugin. Internally, the editor grabs all of those plugin-like properties, and turns them into an "editor" plugin that it places first in the plugins stack. So that example above is actually equivalent to...

```javascript
const plugins = [
  { onClick: ..., onKeyDown: ... },
  ...
]

<Editor
  plugins={plugins}
/>
```

This isn't something you need to remember, but it's helpful to know that even the top-level editor props are just another plugin!

## Helper Plugins vs. Feature Plugins

Plugins _can_ do anything and everything. But that doesn't mean you should build plugins that are thousands of lines long that implement every single feature in your editor—your codebase would become hell to maintain. Instead, just like all modules, you should split them up into pieces with separate concerns.

A distinction that helps with this is to consider two different types of plugins: "helper plugins" and "feature plugins".

This distinction is very similar to any other type of packages. You have things like [`chalk`](https://yarnpkg.com/en/package/chalk), [`is-url`](https://yarnpkg.com/en/package/is-url) and [`isomorphic-fetch`](https://yarnpkg.com/en/package/isomorphic-fetch) that are open-source helpers that you compose together to form larger features in your app.

### Helper Plugins

Helper plugins are usually very small, and just serve to easily encapsulate a specific piece of logic that gets re-used in multiple places—often in multiple "feature" plugins.

For example, you may have a simple `Hotkey` plugin that makes binding behaviors to hotkeys a lot simpler:

```javascript
function Hotkey(hotkey, fn) {
  return {
    onKeyDown(event, change, editor) {
      if (isHotkey(hotkey, event)) {
        change.call(fn)
      }
    },
  }
}
```

That pseudo-code allows you to encapsulate the hotkey-binding logic in one place, and re-use it anywhere else you want, like so:

```javascript
const plugins = [
  ...,
  Hotkey('cmd+b', change => change.addMark('bold')),
]
```

These types of plugins are critical to keeping your code maintainable. And they're good candidates for open-sourcing for others to use. A few examples of plugins like this in the wild are [`slate-auto-replace`](https://github.com/ianstormtaylor/slate-plugins/tree/master/packages/slate-auto-replace), [`slate-prism`](https://github.com/GitbookIO/slate-prism), [`slate-collapse-on-escape`](https://github.com/ianstormtaylor/slate-plugins/tree/master/packages/slate-collapse-on-escape), etc.

There's almost no piece of logic too small to abstract out and share, as long as it's reusable.

But hotkey binding logic by itself isn't a "feature". It's just a small helper that makes building more complex features a lot more expressive.

### Feature Plugins

Feature plugins are much larger in scope, and serve to define an entire series of behaviors that make up a single "feature" in your editor. They're not as concrete as util plugins, but they make reasoning about complex editors much simpler.

For example, you maybe decide you want to allow **bold** formatting in your editor. To do that, you need a handful of different behaviors.

You could just have a single, long `plugins.js` file that contained all of the plugins for all of the features in your editor. But figuring out what was going on in that file would get confusing very quickly.

Instead, it can help to split up your plugins into features. So you might have a `bold.js`, `italic.js`, `images.js`, etc. Your bold plugin might look like...

```javascript
function Bold(options) {
  return [
    Hotkey('cmd+b', addBoldMark),
    RenderMark('bold', props => <BoldMark {...props} />),
    RenderButton(props => <BoldButton {...props} />),
    ...
  ]
}
```

This is just pseudo-code, but you get the point.

You've created a single plugin that defines the entire bold "feature". If you go to your editor and you removed the `Bold` plugin, the entire bold "feature" would be removed. Having it encapsulated like this makes it much easier to maintain.

More often than not you actually want to change the return value to not just be an array of plugins, but actually an object containing other helpful tools that are associated with the feature, like pre-defined change functions. For example:

```javascript
function Bold(options) {
  return {
    changes: {
      addBoldMark,
      removeBoldMark,
      toggleBoldMark,
    },
    components: {
      BoldMark,
      BoldButton,
    },
    helpers: {
      hasBoldMark,
    },
    plugins: [
      Hotkey('cmd+b', addBoldMark),
      RenderMark('bold', props => <BoldMark {...props} />),
      RenderButton(props => <BoldButton {...props} />),
      ...
    ]
  }
}
```

With things like `changes` and `helpers`, you can define your bold logic in a single place, and allow other parts of your codebase to use the exposed API to keep consistent. Then you can use them like so:

```javascript
const bold = Bold()
const italic = Italic()
...

const plugins = [
  ...bold.plugins,
  ...italic.plugins,
  ...
]

<Editor
  plugins={plugins}
  ...
/>
```

Feature plugins like that are almost always made up of many smaller helper plugins. And they are usually app-specific, so they don't make great open-source candidates.

### Framework Plugins

That said, there might be another type of plugins that kind of straddle the line. Continuining our analogy to the Javascript package landscape, you might call these "framework" plugins.

These are plugins that bundle up a set of logic, similar to how a feature might, but in a way that is re-usable across codebases. Some examples of these would be [`slate-edit-code`](https://github.com/GitbookIO/slate-edit-code), [`slate-edit-list`](https://github.com/GitbookIO/slate-edit-list), [`slate-edit-table`](https://github.com/GitbookIO/slate-edit-table), etc.

Framework plugins will often expose objects with `changes`, `helpers` and `plugins` instead of a simple array. Or, they may choose to just augment a single returned plugin object with some of the other exports.

You'll often want to encapsulate framework plugins in your own feature plugins, but they can go a long way in terms of reducing your codebase size.

## Best Practices

When you're writing plugins, there are a few patterns to follow that will make your plugins more flexible, and more familiar for others.

If you think of another good pattern, feel free to pull request it!

### Write Plugins as Functions

You should always write plugins as functions that take `options`.

```javascript
function YourPlugin(options) {
  return {
    ...
  }
}
```

This is easy to do, and it means that even if you don't have any options now you won't have to break the API to add them in the future. It also makes it easier to use plugins because you just always assume they're functions.

### Expose Helpers, Changes, etc.

This was alluded to in the previous section, but if your plugin defines helpers like `hasBoldMark` or change functions like `addBoldMark`, based on an option the user passed it, it can be helpful to expose those to the user so they can use the same functions in their own code. The way to do this is to return an object instead of an array from your plugin function:

```javascript
function YourBoldPlugin(options) {
  return {
    helpers: {
      hasBoldMark,
      ...
    },
    changes: {
      addBoldMark,
      ...
    },
    plugins: [
      ...
    ],
  }
}
```

### Accept Change Functions

It's common for helper plugins to want to make some change based on an event that is triggered by the user. For example, when you want to write a plugin that adds a mark when a hotkey is pressed.

If you write this in the naive way as taking a mark `type` string, users won't be able to add data associated with the mark in more complex cases. And if you accept a string or an object, what happens if the user wants to actually add two marks at once, or perform some other piece of logic. You'll have to keep adding esoteric options which make the plugin hard to maintain.

Instead, let the user pass in a "change function", like so:

```javascript
const plugins = [
  AddMark({
    hotkey: 'cmd+b',
    change: change => change.addMark('bold'),
  }),
]
```

Notice how it's still very terse for the simple case. But it means you can do more complex things easily, without having to accept tons of crazy options:

```javascript
const plugins = [
  AddMark({
    hotkey: 'cmd+opt+c',
    change: change => {
      change.addMark({ type: 'comment', data: { id: userId } }).selectAll()
    },
  }),
]
```

And what's even better, since it's a common practice to write change function helpers in your codebase to reuse, users can usually just pass in one of the functions they've already defined:

```javascript
const plugins = [
  AddMark({
    hotkey: 'cmd+b',
    change: addBoldMark,
  }),
]
```

