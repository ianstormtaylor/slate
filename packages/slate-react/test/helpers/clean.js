import { JSDOM } from 'jsdom' // eslint-disable-line import/no-extraneous-dependencies

const UNWANTED_ATTRS = ['data-key', 'data-offset-key']

const UNWANTED_TOP_LEVEL_ATTRS = [
  'autocorrect',
  'spellcheck',
  'style',
  'data-gramm',
]

/**
 * Clean an `element` of unwanted attributes.
 *
 * @param {Element} element
 * @return {Element}
 */

function stripUnwantedAttrs(element) {
  if (typeof element.removeAttribute === 'function') {
    UNWANTED_ATTRS.forEach(attr => element.removeAttribute(attr))

    if (element.parentNode.nodeName === '#document-fragment') {
      UNWANTED_TOP_LEVEL_ATTRS.forEach(attr => element.removeAttribute(attr))
    }
  }

  if (element.childNodes.length) {
    element.childNodes.forEach(stripUnwantedAttrs)
  }

  if (element.nodeName === '#text') {
    element.textContent = element.textContent.trim()
  }

  return element
}

/**
 * Clean a renderer `html` string, removing dynamic attributes.
 *
 * @param {String} html
 * @return {String}
 */

export default function clean(html) {
  const $ = JSDOM.fragment(html)
  $.childNodes.forEach(stripUnwantedAttrs)
  return $.firstChild.outerHTML
}
