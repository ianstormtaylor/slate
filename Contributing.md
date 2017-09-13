
# Contributing

Want to contribute to Slate? That would be awesome!

- [Reporting Bugs](#reporting-bugs)
- [Asking Questions](#asking-questions)
- [Submitting Pull Requests](#submitting-pull-requests)
- [Running Examples](#running-examples)
- [Running Tests](#running-tests)
- [Running Benchmarks](#running-benchmarks)
- [Adding Browser Support](#adding-browser-support)
- [Testing Input Methods](#testing-input-methods)
- [Debugging Slate Methods](#debugging-slate-methods)
- [Publishing Releases](#publishing-releases)


## Reporting Bugs

If you run into any weird behavior while using Slate, feel free to open a new issue in this repository! Please run a **search before opening** a new issue, to make sure that someone else hasn't already reported or solved the bug you've found.

Any issue you open must include:

- A [JSFiddle](https://jsfiddle.net/2zokvrvt/179/) that reproduces the bug with a minimal setup.
- A GIF showing the issue in action. (Using something like [RecordIt](http://recordit.co/).)
- A clear explanation of what the issue is.

Here's a [JSFiddle template for Slate](https://jsfiddle.net/2zokvrvt/179/) to get you started:

[![](./docs/images/jsfiddle.png)](https://jsfiddle.net/2zokvrvt/179/)


## Asking Questions

We've also got a [Slate Slack team](https://slate-slack.herokuapp.com) where you can ask questions and get answers from other people using Slate:

[![](./docs/images/slack.png)](https://slate-slack.herokuapp.com)

Please use the Slack instead of asking questions in issues, since we want to reserve issues for keeping track of bugs and features. We close questions in issues so that maintaining the project isn't overwhelming.


## Submitting Pull Requests

All pull requests are super welcomed and greatly appreciated! Easy issues are marked with an [`easy-one`](https://github.com/ianstormtaylor/slate/issues?q=is%3Aopen+is%3Aissue+label%3Aeasy-one) label if you're looking for a simple place to get familiar with the code base.

Please include tests and docs with every pull request!


## Running Examples

Check out the [Examples readme](./examples) to see how to get the examples running locally!


## Running Tests

To run the tests, you need to have the Slate repository cloned to your computer. After that, you need to `cd` into the directory where you cloned it, and install the dependencies with `yarn` and bootstrap the monorepo:

```
yarn install
yarn run bootstrap
```

Then run the tests with:

```
yarn run test
```

To keep the source rebuilding on every file change, you need to run an additional watching command in a separate process:

```
yarn run watch
```

If you need to debug something, you can add a `debugger` line to the source, and then run `yarn run test debug`. 

If you only want to run a specific test or tests, you can run `yarn run test --fgrep="slate-react rendering"` flag which will filter the tests being run by grepping for the string in each test.


## Running Benchmarks

To run the benchmarks, first make some changes to the source that you want to benchmark. Now that you're ready, you need to save a "baseline" for what the performance was before you made you change.

To do that, stash your changes and save the benchmarks:

```
git stash
yarn run benchmark:save
```

Then once the reference has been saved, unstash your changes and run the benchmarks to see a comparison:

```
git stash pop
yarn run benchmark
```

There will be some subtle changes in iteration speed always, but the comparison reporter will highlight any changes that seem meaningful. You can run `benchmark` multiple times to ensure the speed up persists.


## Adding Browser Support

Slate aims to targeted all of the modern browsers, and eventually the modern mobile platforms. Right now browser support is limited to the latest versions of [Chrome](https://www.google.com/chrome/browser/desktop/), [Firefox](https://www.mozilla.org/en-US/firefox/new/), and [Safari](http://www.apple.com/safari/), but if you are interested in adding support for another modern platform, that is welcomed!


## Testing Input Methods

[Here's a helpful page](https://github.com/Microsoft/vscode/wiki/IME-Test) detailing how to test various input scenarios on Windows, Mac and Linux.


## Debugging Slate Methods

Slate makes use of [debug](https://github.com/visionmedia/debug) to log information about various methods. You can [enable the logger in the browser](https://github.com/visionmedia/debug#browser-support) by setting `localStorage.debug = "*"` (to log methods on all modules) or to a single namespace (e.g. `slate:editor`). Look for `const debug = Debug('<namespace>')` to get the namespace of various modules.


## Publishing Releases

Since we use [Lerna](https://lernajs.io) to manage the Slate packages this is fairly easy, **but** you must make sure you are using `npm` to run the release script, because using `yarn` results in failures. So just run:

```js
npm run release 
```

And follow the prompts Lerna gives you.
