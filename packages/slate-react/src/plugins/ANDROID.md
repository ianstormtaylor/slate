# Android

The following is a list of unexpected behaviors in Android

# API 27

## Missing `onCompositionStar` (FIXED)

### Desciption

Insert a word using the virtual keyboard. Click outside the editor. Touch after the last letter in the word. This will display some suggestions. Click one. Selecting a suggestion will fire the `onCompositionEnd` but will not fire the corresponding `onCompositionStart` before it.

### Fix

Fixed by setting `isComposing` from the `onCompositionEnd` event until the `requestAnimationFrame` callback is executed.


## DOM recreated when suggestion selected on text entirely within a `strong` tag

Touch anywhere in the bold word "rich" in the example. Select an alternative recommendation and we get a failure.

Android is destroying the `strong` tag and replacing it with a `b` tag.

The problem does not present itself if the word is surrounding by spaces before the `strong` tag.

A possible fix may be to surround the word with a `ZERO WIDTH NO-BREAK SPACE` represented as `&#65279;` in HTML. It appears in React for empty paragraphs.