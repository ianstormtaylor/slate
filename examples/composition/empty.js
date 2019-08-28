import { p, text } from './util'

export default {
  text: `Type "hello world" enter "hi" enter "bye" backspace over everything`,
  document: {
    nodes: [p(text(''))],
  },
}
