'use strict';

var config = require('../config/configuration.js');

function htmlReplace(str) {
  return str.replace(/<\/?[^>]+\/?>/g, ' ').replace(/ +/g, ' ').replace(/ ?\n ?/g, '\n').trim();
}

module.exports = function(path, document, changes, finalCb) {
  if(!document.data.html) {
    changes.data.html = document.metadata.text.replace(/\n/g, '<br/>\n');
  }
  else if(!document.metadata.text) {
    changes.metadata.text = htmlReplace(document.data.html);
  }

  changes.metadata.text = (changes.metadata.text) ? changes.metadata.text : document.metadata.text;

  if(document.data.html) {
    config.separators.html.forEach(function(separator) {
      var tmpHTML = document.data.html.split(separator)[0];

      if(tmpHTML !== document.data.html) {
        changes.metadata.text = htmlReplace(tmpHTML);
      }
    });
  }

  if(changes.metadata.text) {
    config.separators.text.forEach(function(separator) {
      var tmpText = changes.metadata.text.split(separator)[0];

      if(tmpText !== changes.metadata.text) {
        changes.metadata.text = tmpText;
      }
    });
  }

  finalCb(null, changes);
};
