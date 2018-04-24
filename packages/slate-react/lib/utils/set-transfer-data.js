'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Set data with `type` and `content` on a `dataTransfer` object.
 *
 * COMPAT: In Edge, custom types throw errors, so embed all non-standard
 * types in text/plain compound object. (2017/7/12)
 *
 * @param {DataTransfer} dataTransfer
 * @param {String} type
 * @param {String} content
 */

function setTransferData(dataTransfer, type, content) {
  try {
    dataTransfer.setData(type, content);
  } catch (err) {
    var prefix = 'SLATE-DATA-EMBED::';
    var text = dataTransfer.getData('text/plain');
    var obj = {};

    // If the existing plain text data is prefixed, it's Slate JSON data.
    if (text.substring(0, prefix.length) === prefix) {
      try {
        obj = JSON.parse(text.substring(prefix.length));
      } catch (e) {
        throw new Error('Failed to parse Slate data from `DataTransfer` object.');
      }
    }

    // Otherwise, it's just set it as is.
    else {
        obj['text/plain'] = text;
      }

    obj[type] = content;
    var string = '' + prefix + JSON.stringify(obj);
    dataTransfer.setData('text/plain', string);
  }
}

/**
 * Export.
 *
 * @type {Function}
 */

exports.default = setTransferData;