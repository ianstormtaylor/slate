const escape = require('shell-quote').quote

/**
 * Need this to fix a bug where we can't commit `pages/examples/[example].tsx`.
 *
 * <https://github.com/okonet/lint-staged/issues/676#issuecomment-574764713>
 *
 * NOTE:
 * We can remove this entire file if/when we upgrade to Prettier 2+ where this
 * is no longer necessary according to the `lint-staged` issue.
 */

module.exports = {
  '*.{ts,tsx,js,json,css,md}': filenames => [
    ...filenames.map(filename => `prettier --check "${escape([filename])}"`),
    ...filenames.map(filename => `git add "${filename}"`),
  ],
  '*.{ts,tsx,js,md}': ['eslint'],
  '*.{ts,tsx,css,md}': ['stylelint'],
}
