/**
 * @param {*} root the root of DOM tree to be normalized
 * @param {*} match the function to check whether the subtree should be normalized
 * @param {*} normalize the function to normalize the subtree
 */
export const normalizeDOMTree = (root, match, normalize, debug = false) => {
  if (!root) return;
  let node = root;
  if (match(node)) {
    normalize(node);
  }
  // recursively run child nodes
  if (root.childNodes) {
    for (let i = 0; i < root.childNodes.length; i += 1) {
      node = root.childNodes[i];
      normalizeDOMTree(node, match, normalize, debug);
    }
  }
}

/*
export const textImgInP_Match = (root) => {
  if (!root) return false;
  if (root.nodeName.toLowerCase() === 'p') {
    if (root.childNodes.length >= 2) {
      const c1 = root.childNodes[0];
      const c2 = root.childNodes[1];
      if (c1.nodeName.toLowerCase() === '#text') {
        if (c2.nodeName.toLowerCase() === 'img') {
          return true;
        }
      }
    }
  }
  return false;
};
*/

export const textImgInP_Match = (root) => {
  if (!root) return false;
  if (root.nodeName.toLowerCase() === 'p') {
    if (root.childNodes.length >= 2) {
      for (let i = 0; i < root.childNodes.length; i += 1) {
        if (root.childNodes[i].nodeName.toLowerCase() === 'img') {
          return true;
        }
      }
    }
  }
  return false;
};

// [body] -> [p] -> [#text]
//               -> [img]
//        -> [xxx]
// [body] -> [p] -> [#text]
//        -> [img]
//        -> [xxx]
/*
export const textImgInP_Normalize = (root) => {
  if (!root) return;
  const c2 = root.childNodes[1];
  root.parentNode.insertBefore(c2, root.nextSibling);
};
*/

/**
 *        body                body
 *         p     n         p img p img n
 *    n img n img          n     n
 */

export const textImgInP_Normalize = (root) => {
  if (!root) return;
  const rootNextSibling = root.nextSibling;
  let current = root.childNodes[0];
  let next = current ? current.nextSibling : null;
  let tmpNodes = [];
  while (current !== null) {
    if (current.nodeName.toLowerCase() === 'img') {
      if (tmpNodes.length > 0) {
        const newNode = document.createElement('p');
        tmpNodes.forEach((tmpNode) => { newNode.appendChild(tmpNode); });
        root.parentNode.insertBefore(newNode, rootNextSibling);
        tmpNodes = [];
      }
      root.parentNode.insertBefore(current, rootNextSibling);
    } else {
      tmpNodes.push(current);
    }
    current = next;
    next = next ? next.nextSibling : null;
  }

  // for last groups of non-image nodes
  if (tmpNodes.length > 0) {
    const newNode = document.createElement('p');
    tmpNodes.forEach((tmpNode) => { newNode.appendChild(tmpNode); });
    root.parentNode.insertBefore(newNode, rootNextSibling);
    tmpNodes = [];
  }

  // root should became empty <p> node
  if (root.childNodes.length > 0) { console.log('something must be wrong'); }
  root.parentNode.removeChild(root);
};

export const preprocess = (html) => {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  console.log('before normalize:', parsed.body.innerHTML);
  normalizeDOMTree(parsed.body, textImgInP_Match, textImgInP_Normalize, true);
  console.log('after normalize:', parsed.body.innerHTML);
  return parsed.body.innerHTML;
};

export const runTestCase = () => {
  // test case
  const html = '<p>123<img src="https://www.google.com.tw"></p>';
  preprocess(html);
};
