const escape = require('shell-quote').quote

/**
 * Need this to fix a bug where we can't commit `pages/examples/[example].tsx`
 *
 * <https://github.com/okonet/lint-staged/issues/676#issuecomment-574764713>
 */

module.exports = {
  '*.{ts,tsx,js,json,css}': filenames => [
    ...filenames.map(filename => `prettier --check "${escape([filename])}"`),
    ...filenames.map(filename => `git add "${filename}"`),
  ],
  '*.{ts,tsx,js}': ['eslint'],
  '*.{ts,tsx,css}': ['stylelint'],
}
