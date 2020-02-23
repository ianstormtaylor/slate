One of the powerful features of Slate is the ability to use it as a controlled input. This means that in our `onChange`, we can mutate the `value` and pass it back to the `<Slate />` component. 

For example, let's say we have a document in which we always want the first paragraph to be uppercase. In a controlled implementation, we would want something like the code below:

```js
const App = () => {
  const [value, setValue] = useState([
    {
      children: [{ text: 'This line should be uppercase' }],
    },
  ])

  const onChange = value => {
    value[0].children[0].text = value[0].children[0].text.toUpperCase()
    setValue(value)
  }

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable renderElement={renderElement} autoFocus />
    </Slate>
  )
}
```

However, if we try this we'll get an error like `Cannot assign to read only property 'text' of object`. This is because the Slate `value` is [frozen](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze), e.g. immutable. 

To correctly mutate our controlled `value`, we use the [immer.js](https://immerjs.github.io/) library, which is what Slate uses internally to manage state updates. We simply use the `createDraft` of immer to create a mutable "draft" of our `value`, make our changes, and then call `finishDraft` on our draft `value` before passing it back to Slate.

```js
import { createDraft, finishDraft } from 'immer'

const onChange = value => {
  const _value = createDraft(value)
  _value[0].children[0].text = _value[0].children[0].text.toUpperCase()
  setValue(finishDraft(_value))
}
```

With the working code, we'll see our first line transformed to `THIS LINE SHOULD BE UPPERCASE` and if you type anything else on that line, it will be converted to uppercase as you type!

You can find a more advanced example of controlled updates in the [Controlled Updates](https://slatejs.org/examples/controlled-updates) example.