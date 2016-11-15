
# Contributing

Want to contribute to Slate? That would be awesome!

- [Reporting Bugs](#reporting-bugs)
- [Asking Questions](#asking-questions)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Running Tests](#running-tests)
- [Running Examples](#running-examples)
- [Adding Browser Support](#adding-browser-support)


## Reporting Bugs

If you run into any weird behavior while using Slate, feel free to open a new issue in this repository! To be most helpful, please include the steps to reproduce the bug as best you can, ideally including a [JSFiddle](https://jsfiddle.net/2zokvrvt/7/) with a working example of the bug.

Here's a [JSFiddle template for Slate](https://jsfiddle.net/2zokvrvt/7/) to get you started:

[![](./docs/images/jsfiddle.png)](https://jsfiddle.net/2zokvrvt/7/)


## Asking Questions

Questions are very welcome :smile:! Previous questions that folks have asked are tagged with a [`question`](https://github.com/ianstormtaylor/slate/issues?q=is%3Aissue+is%3Aclosed+label%3Aquestion) label, so before opening a new issue double-check that someone hasn't asked it before. But if you don't see anything, or if you're not sure if it's the same, err on the side of asking!

We've also got a [Slate Slack team](https://slate-slack.herokuapp.com) where you can ask questions and get answers from other people using Slate:

[![](./docs/images/slack.png)](https://slate-slack.herokuapp.com)


## Submitting Pull Requests

All pull requests are super welcomed and greatly appreciated! Easy issues are marked with an [`easy-one`](https://github.com/ianstormtaylor/slate/issues?q=is%3Aopen+is%3Aissue+label%3Aeasy-one) label if you're looking for a simple place to get familiar with the code base.

Please include tests and docs with every pull request!


## Running Tests

To run the examples, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies from `npm`.

```
npm install
```

Which will also compile the source files. Then run the tests with:

```
npm run tests
```

If you need to debug something, you can add a `debugger` line to the source, and then run `npm run tests debug`. Or, if you only want to run a specific test or tests, you can run `npm run tests -- --fgrep "match this string"` flag which will filter the tests being run.

To keep the source rebuilding on every file change, you need to run an additional watching command:

```
npm run watch
```


## Running Examples

Check out the [Examples readme](./examples) to see how to get the examples running locally!


## Adding Browser Support

Slate aims to targeted all of the modern browsers, and eventually the modern mobile platforms. Right now browser support is limited to the latest versions of [Chrome](https://www.google.com/chrome/browser/desktop/), [Firefox](https://www.mozilla.org/en-US/firefox/new/), and [Safari](http://www.apple.com/safari/), but if you are interested in adding support for another modern platform, that is welcomed!


