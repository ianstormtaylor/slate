import { p, text, bold } from './util'

export default {
  text: `Follow the instructions on each line exactly`,
  document: {
    nodes: [
      p(
        bold(
          'Cursor to "mid|dle" then press space then backspace. Should say "middle" again.'
        )
      ),
      p('The middle word.'),
    ],
  },
}
