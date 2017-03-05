
export default function (state) {
  const { document, selection } = state;
  const texts = document.getTexts();
  const first = texts.first();
  const second = texts.last();
  const range = selection.merge({
    anchorKey: first.key,
    anchorOffset: 0,
    focusKey: second.key,
    focusOffset: 0
  });

  return state
    .transform()
    .unwrapInlineAtRange(range, 'link')
    .apply()
}
