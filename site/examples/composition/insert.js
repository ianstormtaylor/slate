import { p, text, bold } from './util'

export default {
  text: `Enter text below each line of instruction exactly including mis-spelling wasnt`,
  document: {
    nodes: [
      p(bold('Tap on virtual keyboard: '), text('It wasnt me. No.')),
      p(),
      p(bold('Gesture write: '), text('Yes Sam, I am.')),
      p(),
      p(bold('If you have IME, write any two words with it')),
      p(),
    ],
  },
}
