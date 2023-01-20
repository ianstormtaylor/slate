/**
 * Returns a set of rules that use the `:where` selector if it is supported,
 * otherwise it falls back to the provided selector on its own.
 *
 * The `:where` selector is used to give a selector a lower specificity,
 * allowing the rule to be overridden by a user-defined stylesheet.
 *
 * Older browsers do not support the `:where` selector.
 * If it is not supported, the selector will be used without `:where`,
 * which means that the rule will have a higher specificity and a user-defined
 * stylesheet will not be able to override it easily.
 */
export function whereIfSupported(selector: string, styles: string): string {
  return (
    `@supports (selector(:where(${selector}))) {` +
    `:where(${selector}) { ${styles} }` +
    `}` +
    `@supports not (selector(:where(${selector}))) {` +
    `${selector} { ${styles} }` +
    `}`
  )
}
