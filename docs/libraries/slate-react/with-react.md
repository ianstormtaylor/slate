# withReact

Adds React and DOM specific behaviors to the editor.

### `withReact<T extends Editor>(editor: T, clipboardFormatKey = 'x-slate-fragment'): T & ReactEditor`

When used with withHistory, withReact should be applied outside. For example:

```typescript
const [editor] = useState(() => withReact(withHistory(createEditor())))
```

##### `clipboardFormatKey` option

The `clipboardFormatKey` option allows you to customize the `DataTransfer` type when Slate data is copied to the clipboard. By default, it is `application/x-slate-fragment` but it can be customized using this option.

This can be useful when a user copies from one Slate editor to a differently configured Slate editor. This could cause nodes to be inserted which are not correctly typed for the receiving editor, corrupting the document. By customizing the `clipboardFormatKey` one can ensure that the raw JSON data isn't copied between editors with different schemas.
