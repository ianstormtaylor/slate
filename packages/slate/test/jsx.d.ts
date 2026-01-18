// This allows tests to include Slate Nodes written in JSX without TypeScript complaining.
declare namespace jsx.JSX {
  interface IntrinsicElements {
    editor: {}
    fragment: {}

    selection: {}
    cursor: {}
    anchor: {}
    focus: {}

    element: { [key: string]: any }
    text: { [key: string]: any }

    block: { [key: string]: any }
    inline: { [key: string]: any }
  }
}
