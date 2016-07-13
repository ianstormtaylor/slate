
# Contributing

Want to contribute to Slate? That would be awesome!


#### Running Tests

To run the examples, you need to have the Slate repository cloned to your computed. After that, you need to `cd` into the directory where you cloned it, and run `make install` to install of its dependencies from `npm`.

And then build the source and run the tests:

```
make dist
make test
```

If you need to debug something, you can add a `debugger` line to the source, and then run `make test` with the `DEBUG=true` flag enabled.

To keep the source rebuilding on every file change, you need to run an additional watching command:

```
make watch-dist
```


#### Running Examples

To run the examples, you need to have the Slate repository cloned to your computed. After that, you need to `cd` into the directory where you cloned it, and run `make install` to install of its dependencies from `npm`.

And then build the source and run the examples server:

```
make dist
make start-examples
```

If you want to edit the source while running the examples and have those changes immediately reflected, you need to run two additional watching commands in your terminal:

```
make watch-dist
```
```
make watch-examples
```


#### Pull Requests

All pull requests are super welcomed and greatly appreciated! Easy issues are marked with an [`easy-one`](https://github.com/ianstormtaylor/slate/issues?q=is%3Aopen+is%3Aissue+label%3Aeasy-one) label if you're looking for a simple place to get familiar with the code base.

Please include tests and docs with every pull request!


#### Browser Support

Slate aims to targeted all of the modern browsers, and eventually the modern mobile platforms. Right now browser support is limited to the latest versions of [Chrome](https://www.google.com/chrome/browser/desktop/), [Firefox](https://www.mozilla.org/en-US/firefox/new/), and [Safari](http://www.apple.com/safari/), but if you are interested in adding support for another modern platform, that is welcomed!


