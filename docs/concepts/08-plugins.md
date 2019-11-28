# Plugins

You've already seen how the behaviors of Slate editors can be overriden. These overrides can also be packaged up into "plugins" to be reused, tested and shared. This is one of the most powerful aspects of Slate's architecture.

A plugin is simply a function that takes an `Editor` object and returns it after it has augmented it in some way.

For example, a plugin that handles images:

```js
const withImages = editor => {
  const { exec, isVoid } = editor

  editor.exec = command => {
    if (command.type === 'insert_image') {
      const { url } = command
      const text = { text: '', marks: [] }
      const element = { type: 'image', url, children: [text] }
      Editor.insertNodes(editor)
    } else {
      exec(command)
    }
  }

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(editor)
  }

  return editor
}
```

And then to use the plugin, simply:

```js
import { createEditor } from 'slate'

const editor = withImages(createEditor())

// Later, when you want to insert an image...
editor.exec({
  type: 'insert_image',
  url: 'https://unsplash.com/photos/m0By_H6ofeE',
})
```

This plugin composition model makes Slate extremely easy to extend!

## Helpers Functions

In addition to the plugin functions, you might want to expose helper functions that are used alongside your plugins. For example:

```js
const ImageElement = {
  isImageElement(value) {
    return Element.isElement(element) && element.type === 'image'
  },
}
```

That way you can reuse your helpers. Or even mix them with the core Slate helpers to create your own bundle, like:

```js
import { Element } from 'slate'
import { ImageElement } from './images'

export const MyElement = {
  ...Element,
  ...ImageElement,
}
```

Then you can use `MySelect` everywhere and have access to all your helpers in one place.
