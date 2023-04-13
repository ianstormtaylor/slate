# withReact

The `withReact` plugin enables Slate to work in a React environment. Currently, React is the only first class implementation of Slate available.

### `withReact<T extends Editor>(editor: T, clipboardFormatKey = 'x-slate-fragment'): T & ReactEditor`

Add `ReactEditor` to an instance of any `Editor`.

The `clipboardFormatKey` option allows you to customize the `DataTransfer` type when Slate data is copied to the clipboard. By default, it is `application/x-slate-fragment` but it can be customized using this option.

This can be useful when a user copies from one Slate editor to a differently configured Slate editor. This could cause nodes to be inserted which are not correctly typed for the receiving editor, corrupting the document. By customizing the `clipboardFormatKey` one can ensure that the raw JSON data isn't cpied between editors with different schemas.

Example with `withHistory`:

```typescript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```
