# Android

The following is a list of unexpected behaviors in Android

# Debugging

```
slate:android,slate:before,slate:update,slate:reconcile
```


# API 26/27

Although there are minor differences, API 26/27 behave similarly.

## Enter Handling

- You can't detect an `enter` until it is too late. You detect it by looking for a `beforeInput` event with a data property that is a string that ends in the last character having a character code 10. At this point, Android has manipulated the DOM. We use an ElementSnapshot to record the state of the element earlier and then revert it later so that React doesn't get confused by an out-of-sync DOM. We then programmatically split the block through Slate.
- One exception is hitting enter at the end of a line. In this case, you can detect it by a `beforeInput` with a property `inputType` having a value `insertParagraph`. In this case, we actually can't detect it in the other way because this version of `beforeInput` event has no `data` property for some reason.

# API 28

## DOM breaks when suggestion selected on text entirely within a `strong` tag

Appears similar to the bug in API 27.


## Can't hit Enter at begining of word API27 (probably 26 too)

WORKING ON THIS


## Can't split word with Enter (PARTIAL FIXED)

Move the cursor to `edit|able` where | is the cursor.

Hit `enter` on the virtual keyboard.

The `keydown` event does not indicate what key is being pressed so we don't know that we should be handling an enter. There are two opportunities:

1. The onBeforeInput event has a `data` property that contains the text immediately before the cursor and it includes `edit|` where the pipe indicates an enter.
2. We can look through the text at the end of a composition and simulate hitting enter maybe.

### Fixed for API 28

Allow enter to go through to the before plugin even during a compositiong and it works in API 28.

### Broken in API 27


# API 27

## Typing at end of line yields wrong cursor position (FIXED)

When you enter any text at the end of a block, the text gets entered in the wrong position.

### Fix

Fixed by ignoring the `updateSelection` code in `content.js` on the `onEvent` method if we are in Android. This doesn't ignore `updateSelection` altogether, only in that one place.



## Missing `onCompositionStart` (FIXED)

### Desciption

Insert a word using the virtual keyboard. Click outside the editor. Touch after the last letter in the word. This will display some suggestions. Click one. Selecting a suggestion will fire the `onCompositionEnd` but will not fire the corresponding `onCompositionStart` before it.

### Fix

Fixed by setting `isComposing` from the `onCompositionEnd` event until the `requestAnimationFrame` callback is executed.


## DOM breaks when suggestion selected on text entirely within a `strong` tag

Touch anywhere in the bold word "rich" in the example. Select an alternative recommendation and we get a failure.

Android is destroying the `strong` tag and replacing it with a `b` tag.

The problem does not present itself if the word is surrounding by spaces before the `strong` tag.

A possible fix may be to surround the word with a `ZERO WIDTH NO-BREAK SPACE` represented as `&#65279;` in HTML. It appears in React for empty paragraphs.


