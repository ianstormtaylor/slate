import { p, text, bold } from './util'

export default {
  text: `Select from start to end then press backspace. Move cursor to end. Backspace over all the remaining content.`,
  document: {
    nodes: [
      p(bold('Select'), text(' from START and then')),
      p(text('go and select')),
      p(text('to the END then press '), bold('backspace.')),
      p(text('After you have done that move selection to very end')),
      p(
        text('Then try '),
        bold('backspacing'),
        text(' over all remaining text.')
      ),
    ],
  },
}
