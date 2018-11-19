# Resources

A few resources that are helpful for building with Slate.

## Libraries

These libraries are helpful when developing with Slate:

* [`is-hotkey`](https://github.com/ianstormtaylor/is-hotkey) is a simple way to check whether an `onKeyDown` handler should fire for a given hotkey, handling cross-platform concerns like <kbd>cmd</kbd> vs. <kbd>ctrl</kbd> keys for you automatically.
* [`react-broadcast`](https://github.com/ReactTraining/react-broadcast) works well when you need to have your custom node components re-render based on state that lives outside the `document`. It's the same pattern that `react-router` uses to update `<Link>` components.

## Tools

These tools are helpful when developing with Slate:

* [Immutable.js Console Extension](https://github.com/mattzeunert/immutable-object-formatter-extension) greatly improves the `console.log` output when working with [Immutable.js](https://facebook.github.io/immutable-js/) objects, which Slate's data model is based on.

## Products

These products use Slate, and can give you an idea of what's possible:

* [Cake](https://www.cake.co/)
* [Chatterbug](https://chatterbug.com)
* [GitBook](https://www.gitbook.com/)
* [Grafana](https://grafana.com/)
* [Guru](https://www.getguru.com/)
* [Outline](https://www.getoutline.com/)
* [Sanity.io](https://www.sanity.io)
* [Taskade](https://www.taskade.com/)
* [Yuque](https://www.yuque.com/)

## Editors

These pre-packaged editors are built on top of Slate, and can be helpful to see how you might structure your code:

* [Canner Editor](https://github.com/Canner/canner-slate-editor) is a rich text editor.
* [French Press Editor](https://github.com/roast-cms/french-press-editor) is a customizeable editor with offline support.
* [Nossas Editor](http://slate-editor.bonde.org/) is a drop-in WYSIWYG editor.
* [ORY Editor](https://editor.ory.am/) is a self-contained, inline WYSIWYG editor library.
* [Outline Editor](https://github.com/outline/rich-markdown-editor) is the editor that powers the [Outline](https://www.getoutline.com/) wiki.
* [Chatterslate](https://github.com/chatterbugapp/chatterslate) helps teach language grammar and more at [Chatterbug](https://chatterbug.com).

(Or, if you have their exact use case, can be a drop-in editor for you.)
