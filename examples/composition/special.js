import { p, text, bold } from './util'

export default {
  text: `Follow the instructions on each line exactly`,
  document: {
    nodes: [
      p(bold('Type "it is". cursor to "i|t" then hit enter.')),
      p(text('')),
      p(
        bold(
          'Cursor to "mid|dle" then press space, backspace, space, backspace. Should say "middle".'
        )
      ),
      p(text('The middle word.')),
      p(
        bold(
          'Cursor in line below. Wait for caps on keyboard to show up. If not try again. Type "It me. No." and it should not mangle on the last period.'
        )
      ),
      p(text('')),
    ],
  },
}
