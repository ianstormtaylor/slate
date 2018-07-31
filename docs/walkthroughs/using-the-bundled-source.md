# Using the Bundled Source

For most folks, you'll want to install Slate via `npm`, in which case you can follow the regular [Installing Slate](./installing-slate.md) guide.

But, if you'd rather install Slate by simply adding a `<script>` tag to your application, this guide will help you. To make the "bundled" use case simpler, each version of Slate ships with a bundled source file called `slate.js`.

To get a copy of `slate.js`, download the version of slate you want from npm:

```
npm install slate@latest
```

And then look in the `node_modules` folder for the bundled `slate.js` file:

```
node_modules/
  slate/
    dist/
      slate.js
      slate.min.js
```

A minified version called `slate.min.js` is also included for convenience.

Before you can add `slate.js` to your page, you need to bring your own copy of `immutable`, `react`, `react-dom` and `react-dom-server`, like so:

```html
<script src="./vendor/react.js"></script>
<script src="./vendor/react-dom.js"></script>
<script src="./vendor/react-dom-server.js"></script>
<script src="./vendor/immutable.js"></script>
```

This ensures that Slate isn't bundling its own copy of Immutable and React, which would greatly increase the file size of your application.

Then you can add `slate.js` after those includes:

```html
<script src="./vendor/slate.js"></script>
```

To make things easier, for quick prototyping, you can also use the [`unpkg.com`](https://unpkg.com/#/) delivery network that makes working with bundled npm modules easier. In that case, your includes would look like:

```html
<script src="https://unpkg.com/react/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/react-dom/umd/react-dom-server.browser.production.min.js"></script>
<script src="https://unpkg.com/immutable/dist/immutable.js"></script>
<script src="https://unpkg.com/slate/dist/slate.js"></script>
<script src="https://unpkg.com/slate-react/dist/slate-react.js"></script>
```

That's it, you're ready to go!

<br/>
<p align="center"><strong>Next:</strong><br/><a href="./adding-event-handlers.md">Adding Event Handlers</a></p>
<br/>
