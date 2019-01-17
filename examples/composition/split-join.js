import { p, text, bold } from './util'

export default {
  text: `Hit enter x2 then backspace x2 before word "before", after "after", and in "middle" between two "d"s`,
  document: {
    nodes: [
      p(
        text('Before it before it '),
        bold('before'),
        text(' it middle it '),
        bold('middle'),
        text(' it after it '),
        bold('after'),
        text(' it after')
      ),
    ],
  },
}
