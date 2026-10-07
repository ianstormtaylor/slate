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
