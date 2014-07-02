'use strict';

var config = require('../config/configuration.js');

function htmlReplace(str) {
  return str.replace(/<\/?[a-z1-9]+(\s+[a-z]+=["'](.*)["'])*\/?>/g, ' ').replace(/ +/g, ' ').replace(/ ?\n ?/g, '\n').trim();
}

module.exports = function(path, document, changes, finalCb) {
  if(document.data.html === undefined) {
    changes.data.html = document.metadata.text;
  }
  else if(document.metadata.text === undefined) {
    changes.metadata.text = htmlReplace(document.data.html);
  }

  changes.metadata.text = (changes.metadata.text) ? changes.metadata.text : document.metadata.text;

  if(document.data.html) {
    config.separators_html.some(function(separator) {
      var tmpHTML = document.data.html.split(separator)[0];

      if(tmpHTML !== document.data.html) {
        changes.metadata.text = htmlReplace(tmpHTML);
        return true;
      }
      return false;
    });
  }

  if(changes.metadata.text === document.metadata.text) {
    config.separators_text.some(function(separator) {
      var tmpText = changes.metadata.text.split(separator)[0];

      if(tmpText !== changes.metadata.text) {
        changes.metadata.text = tmpText;
        return true;
      }
      return false;
    });
  }

  finalCb(null, changes);
};
