# Android

The following is a list of unexpected behaviors in Android

# Debugging

```
slate:android,slate:before,slate:update,slate:reconcile
```

# API 28

### Backspace Handling

- join previous paragraph
  + compositionEnd
  + keydown:Unidentified
  + beforeinput:deleteContentBackward
  + DOM change
  + input:deleteContentBackward

## Two Words. One.

Type two words followed by a period. Then one word followed by a period.

The space after the second period is deleted. It does not happen if there is only one word followed by a period.

# API 26/27

Although there are minor differences, API 26/27 behave similarly.

### Backspace Handling

- Save the state using a snapshot during a `keydown` event as it may end up being a delete. The DOM is in a good before state at this time.
- Look at the `input` event to see if `event.nativeEvent.inputType` is equal to `deleteContentBackward`. If it is, then we are going to have to handle a delete but the DOM is already damaged.
- If we are handling a delete then:
  + stop the `reconciler` which was started at `compositionEnd` because we don't need to reconcile anything as we will be reverting dom then deleting.
  + start the `deleter` which will revert to the snapshot then execute the delete command within Slate after a `requestAnimationFrame` time.
  + HOWEVER! if an `onBeforeInput` is called before the `deleter` handler is executed, we now know that it wasn't a delete after all and instead it was responding to a text change from a suggestion. In this case:
    * cancel the `deleter`
    * resume the `reconciler`

### Enter Handling

- Save the state using a snapshot during a `compositionEnd` event as it may end up being an `enter`. The DOM is in a good before state at this time.
- Look at the native version of the `beforeInput` event (two will fire a native and a React). Note: We manually forced Android to handle the native `beforeInput` by adding it to the `content` code.
- If the `event.nativeEvent.inputType` is equal to `insertParagraph` or `insertLineBreak` then we have determined that the user pressed enter at the end of a block (and only at the end of a block).
- If `enter is detected then:
  + `preventDefault`
  + set Slate's selection using the DOM
  + call `splitBlock`
  + Put some code in to make sure React's version of `beforeInput` doesn't fire by setting a variable. React's version will fire as it can't be cancelled from the native version even though we told it to stop.
- During React's version of `beforeInput`, if the `data` property which is a string ends in a linefeed (character code 10) then we know that it was an enter anywhere other than the end of block. At this point the DOM is already damaged.
- If we are handling an enter then:
  + cancel the reconciler which was started from the `compositionEnd` event because we don't want reconciliation from the DOM to happen.
  + wait until next animation frame
  + revert to the last good state
  + splitBlock using Slate

Events for different cases

- Start of word & Start of line
  + compositionEnd
  + keydown:Unidentified
  + input:deleteContentBackward START DELETER
  + keydown:Enter *
  + beforeInput:insertParagraph *
  + TOO LATE TO CANCEL
- Middle of word
  + compositionEnd
  + keydown:Unidentified
  + input:deleteContentBackward START DELETER => SELF 
  + keydown:Unidentified
  + beforeInput:CHR(10) at end *
  + TOO LATE TO CANCEL
- End of word
  + compositionEnd
  + keydown:Enter *
  + beforeInput:insertParagraph
  + CANCELLABLE
- End of line
  + keydown:Enter *
  + beforeInput:insertParagraph
  + CANCELLABLE

Based on the previous cases:

- Use a snapshot if `input:deleteContentBackward` is detected before an Enter which is detected either by a `keydown:Enter` or a `beforeInput:insertParagraph` and we don't know which.
- Cancel the event if we detect a `keydown:Enter` without an immediately preceding `input:deleteContentBackward`.

### Enter at Start of Line
**TODO:**

- Go through all the steps in the Backspace handler. An enter at the beginning of a block looks exactly like a `delete` action at the beginning. The `reconciler` will be cancelled in the course of these events.
- A `keydown` event will fire with `event.key` === `Enter`. We need to set a variable `ENTER_START_OF_LINE` to `true`. Cancel the delete event and remove the reference.
- NOTE!!! Looks like splitting at other positions (not end of line) also provides an `Enter` and might be preferable to using the native `beforeInput` which we had to hack in!!! Try this!!!
- A `beforeinput` event will be called like in the `delete` code which usually cancels the `deleter` and resumes the `reconciler`. But since we removed the reference to the `deleter` neither of these methods are called.
- 


**!!!!!!!!!WORKING ON SOMETHING**
If we revert to head, we will be in a safe spot.
Right now, I played with using `keydown` and `enter` instead of the `beforeInput` stuff.
But hitting backspace from beginning of second line then hitting enter again breaks!



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


