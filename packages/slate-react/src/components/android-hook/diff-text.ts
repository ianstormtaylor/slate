export type Diff = {
  start: number
  end: number
  insertText: string
}

function applyDiffs(text: string, ...diffs: Diff[]) {
  return diffs.reduce(
    (text, diff) =>
      text.slice(0, diff.start) + diff.insertText + text.slice(diff.end),
    text
  )
}

export function mergeDiffs(text: string, a: Diff, b: Diff): Diff {
  const start = Math.min(a.start, b.start)
  const overlap = Math.max(
    0,
    Math.min(a.start + a.insertText.length, b.end) - b.start
  )

  const applied = applyDiffs(text, a, b)
  const sliceEnd = Math.max(
    b.start + b.insertText.length,
    a.start +
      a.insertText.length +
      (a.start + a.insertText.length > b.start ? b.insertText.length : 0) -
      overlap
  )

  return {
    start,
    end: Math.max(a.end, b.end - a.insertText.length + (a.end - a.start)),
    insertText: applied.slice(start, sliceEnd),
  }
}
