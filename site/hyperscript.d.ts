declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    hp: any
    editor: any
    htext: {
      // These optional params will show up in the autocomplete!
      bold?: boolean
      underline?: boolean
      italic?: boolean
      children?: any
    }
    hbulletedlist: any
    hlistitem: any
    cursor: any
    focus: any
    anchor: any
  }
}
