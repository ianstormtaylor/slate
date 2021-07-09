const escape = require('shell-quote').quote

/**
 * Need this to fix a bug where we can't commit this:
 *
 * `pages/examples/[example].tsx`.
 *
 * because of the square brackets `[` and `]`.
 *
 * <https://github.com/okonet/lint-staged/issues/676#issuecomment-574764713>
 *
 * NOTE:
 *
 * We can remove this entire file if/when we upgrade to Prettier 2+ where this
 * is no longer necessary according to the `lint-staged` issue shown above.
 *
 * Currently, the same configuration without the escaping of the filename
 * still exists in `package.json` but this takes precedence over that.
 *
 * Once this file is removed, `package.json` configuration will be used.
 */

module.exports = {
  '*.{ts,tsx,js,jsx,json,css,md}': filenames => [
    ...filenames.map(filename => `prettier --write "${escape([filename])}"`),
    ...filenames.map(filename => `git add "${filename}"`),
  ],
  '*.{ts,tsx,js,jsx,json,css,md}': ['eslint --fix'],
}
