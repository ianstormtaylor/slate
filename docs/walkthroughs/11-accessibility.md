# Accessibility

Slate renders the editable root as a `contenteditable` element with `role="textbox"` and `aria-multiline="true"`. Everything else that makes an editor usable with a screen reader or a keyboard depends on what you render, so this guide lists what Slate does for you and what you need to add.

## Name the editor

A textbox without a name is announced as just "edit text". Pass `aria-label` or `aria-labelledby` to `Editable`; it forwards them to the root element.

```jsx
<h2 id="comment-heading">Comment</h2>
<Editable aria-labelledby="comment-heading" />
```

When the page has a visible heading or label for the editor, prefer `aria-labelledby` so the visible text and the announced name stay the same.

Any other `aria-*` attribute you pass to `Editable` also lands on the root, such as `aria-describedby`, or `aria-autocomplete`, `aria-controls` and `aria-activedescendant` when the editor is the input of a combobox or mention picker.

## Placeholders

While the placeholder is visible, Slate sets `aria-placeholder` on the root, and marks the visual placeholder `aria-hidden`, so assistive technology announces the hint once, as a hint, instead of reading it as document content.

If you pass `renderPlaceholder`, spread the `attributes` you receive onto your element to keep that behavior.

## Read-only editors

With `readOnly`, Slate removes `role="textbox"` and `aria-multiline`, because the content is no longer editable. The root is then a plain `div`, and ARIA doesn't allow naming one, so screen readers may ignore an `aria-label` on it. If read-only content needs a name, wrap it in a labelled landmark instead:

```jsx
<section aria-label="Release notes">
  <Editable readOnly />
</section>
```

## Toolbars

- Render toolbar controls as `<button>` elements, so they are focusable and activate with Enter and Space.
- Give icon-only buttons an `aria-label`.
- Set `aria-pressed` on buttons that toggle a mark or block type, so their state is announced.
- Call `event.preventDefault()` in `onPointerDown`. Then a click doesn't move focus or the selection out of the editor.

The shared `Button` in the examples sets `aria-pressed` from its `active` prop.

## Voids and embedded controls

Controls rendered inside void elements, such as inputs in an editable void or a URL field under an embed, need their own labels like any other form control: a `<label>` around the input, or an `aria-label`. Give embedded `<iframe>` elements a `title`.

Images need an `alt`. When your image elements don't store a description, `alt=""` is the honest choice: it marks the image as decorative rather than having the file name announced.

## Keyboard

`Editable` doesn't handle Tab, so Tab and Shift+Tab move focus into and out of the editor. If you bind Tab to indentation or list nesting, give keyboard users another way to leave the editor, and document it near the editor.

## Testing

Automated checkers such as [axe-core](https://github.com/dequelabs/axe-core) catch missing names, labels and contrast problems, and are worth running against your editor. They can't tell you whether editing works with a screen reader. Check that by typing, selecting and using your toolbar with VoiceOver on macOS or iOS, and NVDA or JAWS on Windows.
