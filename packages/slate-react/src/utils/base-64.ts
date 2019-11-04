/**
 * Encode a JSON object as a Base64 string.
 */

export const encode = (object: any): string => {
  const string = JSON.stringify(object)
  const encoded = window.btoa(encodeURIComponent(string))
  return encoded
}

/**
 * Decode a Base64 string to a JSON object.
 */

export const decode = (string: string): any => {
  const decoded = decodeURIComponent(window.atob(string))
  const object = JSON.parse(decoded)
  return object
}
