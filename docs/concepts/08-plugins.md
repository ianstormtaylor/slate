# Plugins

You've already seen how the behaviors of Slate editors can be overridden. These overrides can also be packaged up into "plugins" to be reused, tested and shared. This is one of the most powerful aspects of Slate's architecture.

A plugin is simply a function that takes an `Editor` object and returns it after it has augmented it in some way.

For example, a plugin that marks image nodes as "void":

```javascript
const withImages = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  return editor
}
```

And then to use the plugin, simply:

```javascript
import { createEditor } from 'slate'

const editor = withImages(createEditor())
```

This plugin composition model makes Slate extremely easy to extend!

## Helper Functions

In addition to the plugin functions, you might want to expose helper functions that are used alongside your plugins. For example:

```javascript
import { Editor, Element } from 'slate'

const MyEditor = {
  ...Editor,
  insertImage(editor, url) {
    const element = { type: 'image', url, children: [{ text: '' }] }
    Transforms.insertNodes(editor, element)
  },
}

const MyElement = {
  ...Element,
  isImageElement(value) {
    return Element.isElement(element) && element.type === 'image'
  },
}
```

Then you can use `MyEditor` and `MyElement` everywhere and have access to all your helpers in one place.
