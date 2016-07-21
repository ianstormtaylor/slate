
# Contributing

Want to contribute to Slate? That would be awesome!


### Running Tests

To run the examples, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies from `npm`.

```
npm install
```

Which will also compile the source files. Then run the tests with:

```
npm test
```

And to run the linter:

```
npm run lint
```

Or you can run both with `make check`, which is what is run by default.

If you need to debug something, you can add a `debugger` line to the source, and then run `npm test --debug`. Or, if you only want to run a specific test or tests, you can run `npm test --fgrep "match thisstring"` flag which will filter the tests being run.

To keep the source rebuilding on every file change, you need to run an additional watching command:

```
npm run dist:watch
```


### Running Examples

Check out the [Examples readme](./examples) to see how to get the examples running locally!


### Pull Requests

All pull requests are super welcomed and greatly appreciated! Easy issues are marked with an [`easy-one`](https://github.com/ianstormtaylor/slate/issues?q=is%3Aopen+is%3Aissue+label%3Aeasy-one) label if you're looking for a simple place to get familiar with the code base.

Please include tests and docs with every pull request!


### Browser Support

Slate aims to targeted all of the modern browsers, and eventually the modern mobile platforms. Right now browser support is limited to the latest versions of [Chrome](https://www.google.com/chrome/browser/desktop/), [Firefox](https://www.mozilla.org/en-US/firefox/new/), and [Safari](http://www.apple.com/safari/), but if you are interested in adding support for another modern platform, that is welcomed!


