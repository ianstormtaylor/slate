// biome-ignore lint/suspicious/noVar: type
declare var jsx: typeof import('slate-hyperscript').jsx

// biome-ignore lint/style/noNamespace: JSX typing requires namespace declarations here
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}

// biome-ignore lint/style/noNamespace: jsx.JSX typing supports the legacy imported-factory files
declare namespace jsx.JSX {
  interface IntrinsicElements {
    [elemName: string]: any // eslint-disable-line
  }
}
