# Slate React Event Handling

By default, the `Editable` component comes with a set of event handlers that handle typical rich-text editing behaviors (for example, it implements its own `onCopy`, `onPaste`, `onDrop`, and `onKeyDown` handlers).

In some cases you may want to extend or override Slate's default behavior, which can be done by passing your own event handler(s) to the `Editable` component.

Your custom event handler can control whether or not Slate should execute its own event handling for a given event after your handler runs depending on the return value of your event handler as described below.

```jsx
import {Editable} from 'slate-react';

function MyEditor() {
  const onClick = event => {
    // Implement custom event logic...

    // When no value is returned, Slate will execute its own event handler when
    // neither isDefaultPrevented nor isPropagationStopped was set on the event
  };

  const onDrop = event => {
    // Implement custom event logic...

    // No matter the state of the event, treat it as being handled by returning
    // true here, Slate will skip its own event handler
    return true;
  };

  const onDragStart = event => {
    // Implement custom event logic...

    // No matter the status of the event, treat event as *not* being handled by
    // returning false, Slate will execute its own event handler afterward
    return false;
  };

  return (
    <Editable
      onClick={onClick}
      onDrop={onDrop}
      onDragStart={onDragStart}
      {/*...*/}
    />
  )
}
```

## Native `input` events

Slate applies most edits itself instead of letting the browser change the DOM. For each `beforeinput` event it usually calls `preventDefault()` and applies the change with transforms, so the browser never fires the matching `input` event. That includes deletions, line breaks, pastes, digits and punctuation.

The browser inserts the text natively, and fires `input`, only when all of these hold:

- the edit types a single letter `a`–`z` or a space
- the selection is collapsed and isn't at the start of a text node
- no marks are pending, such as after toggling bold with nothing selected
- the caret isn't at the end of a link

So don't rely on `onInput`, or a native `input` listener on the editable element, to observe changes. Instead:

- use `onValueChange` (or `onChange`) on `<Slate>` to react to every change of the value
- use `onDOMBeforeInput` on `<Editable>` to see, or take over, an edit before Slate applies it
