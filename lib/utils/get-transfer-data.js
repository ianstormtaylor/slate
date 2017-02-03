'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _base = require('../serializers/base-64');

var _base2 = _interopRequireDefault(_base);

var _types = require('../constants/types');

var _types2 = _interopRequireDefault(_types);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Fragment matching regexp for HTML nodes.
 *
 * @type {RegExp}
 */

var FRAGMENT_MATCHER = /data-slate-fragment="([^\s]+)"/;

/**
 * Get the data and type from a native data `transfer`.
 *
 * @param {DataTransfer} transfer
 * @return {Object}
 */

function getTransferData(transfer) {
  var fragment = transfer.getData(_types2.default.FRAGMENT) || null;
  var node = transfer.getData(_types2.default.NODE) || null;
  var html = transfer.getData('text/html') || null;
  var rich = transfer.getData('text/rtf') || null;
  var text = transfer.getData('text/plain') || null;
  var files = void 0;

  // If there isn't a fragment, but there is HTML, check to see if the HTML is
  // actually an encoded fragment.
  if (!fragment && html && ~html.indexOf('<span data-slate-fragment="')) {
    var matches = FRAGMENT_MATCHER.exec(html);

    var _matches = _slicedToArray(matches, 2),
        full = _matches[0],
        encoded = _matches[1]; // eslint-disable-line no-unused-vars


    if (encoded) fragment = encoded;
  }

  // Decode a fragment or node if they exist.
  if (fragment) fragment = _base2.default.deserializeNode(fragment);
  if (node) node = _base2.default.deserializeNode(node);

  // Get and normalize files if they exist.
  if (transfer.items && transfer.items.length) {
    var fileItems = Array.from(transfer.items).map(function (item) {
      return item.kind == 'file' ? item.getAsFile() : null;
    }).filter(function (exists) {
      return exists;
    });

    if (fileItems.length) files = fileItems;
  }

  if (transfer.files && transfer.files.length) {
    files = Array.from(files);
  }

  // Determine the type of the data.
  var data = { files: files, fragment: fragment, html: html, node: node, rich: rich, text: text };
  data.type = getTransferType(data);
  return data;
}

/**
 * Get the type of a transfer from its `data`.
 *
 * @param {Object} data
 * @return {String}
 */

function getTransferType(data) {
  if (data.fragment) return 'fragment';
  if (data.node) return 'node';

  // COMPAT: Microsoft Word adds an image of the selected text to the data.
  // Since files are preferred over HTML or text, this would cause the type to
  // be considered `files`. But it also adds rich text data so we can check
  // for that and properly set the type to `html` or `text`. (2016/11/21)
  if (data.rich && data.html) return 'html';
  if (data.rich && data.text) return 'text';

  if (data.files) return 'files';
  if (data.html) return 'html';
  if (data.text) return 'text';
  return 'unknown';
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = getTransferData;