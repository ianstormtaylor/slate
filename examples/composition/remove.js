import { p, text, bold } from './util'

export default {
  text: `Select from ANCHOR to FOCUS then press backspace. Move cursor to end. Backspace over all the remaining content.`,
  document: {
    nodes: [
      p(text('Go and '), bold('select'), text(' from this ANCHOR and then')),
      p(text('go and select')),
      p(text('to this FOCUS then press '), bold('backspace.')),
      p(text('After you have done that move selection to very end.')),
      p(
        text('Then try '),
        bold('backspacing'),
        text(' over all remaining text.')
      ),
    ],
  },
}
