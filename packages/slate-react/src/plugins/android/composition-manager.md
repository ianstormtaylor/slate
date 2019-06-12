# CompositionManager

Android version 8 and 9 use `CompositionManager` for compatibility.

## MutationObserver

The `CompositionManager` looks at mutations using `MutationObserver` and
bypasses all other event processing from the `dom` plugin.

It uses mutations to determine how to modify the Editor `value` where `dom`
uses events to determine how to modify the Editor `value`.

## How It Works

We try to avoid an Editor `render` in the middle of a composition. At the same
time we want to make sure all mutations are eventually reflected in the Editor
`value`.

### Actions

`MutationObserver` emits batches of `mutations`.

We also batch these batches into actions. Each action contains all the
mutations that are emitted within a single `requestAnimationFrame`.

We do this because some actions like hitting `enter` might trigger multiple
batches of `mutations` but these multiple batches of `mutations` are all part
of one `enter` action.

We get so many mutations because there are many DOM manipulations required to
split a node. The browser has to split the current text node in two and it
also has to clone all of the surrounding mark, inline and block nodes.
