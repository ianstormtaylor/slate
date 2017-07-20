import parse5 from 'parse5'

const UNWANTED_ATTRS = [
  'data-key',
  'data-offset-key'
]

const UNWANTED_TOP_LEVEL_ATTRS = [
  'autocorrect',
  'spellcheck',
  'style',
  'data-gramm'
]

/**
 * Clean an element of unwanted attributes
 *
 * @param {Element} element
 * @return {Element}
 */

function stripUnwantedAttrs(element) {
  if(Array.isArray(element.attrs)) {
    element.attrs = element.attrs.filter(({ name }) => { return !UNWANTED_ATTRS.includes(name) })

    if(element.parentNode.nodeName === '#document-fragment') {
      element.attrs = element.attrs.filter(({ name }) => { return !UNWANTED_TOP_LEVEL_ATTRS.includes(name) })      
    }
  }
  if(Array.isArray(element.childNodes)) {
    element.childNodes.forEach(stripUnwantedAttrs)
  }
  if(element.nodeName === '#text') {
    element.value = element.value.trim()
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
  const $ = parse5.parseFragment(html)
  $.childNodes.forEach(stripUnwantedAttrs)
  return parse5.serialize($)
}
