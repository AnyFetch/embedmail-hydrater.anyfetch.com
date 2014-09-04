'use strict';

var config = require('../config/configuration.js');

function htmlReplace(str) {
  return str
    .replace(/<style.*<\/style>/g, '')
    .replace(/<\/?[^>]+\/?>/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .trim();
}

function processMail(path, document, changes, finalCb) {
  if(!document.data.html) {
    changes.data.html = document.metadata.text.replace(/\n/g, '<br/>\n');
    changes.metadata.text = document.metadata.text;
  }
  else if(!document.metadata.text) {
    changes.metadata.text = htmlReplace(document.data.html);
    changes.data.html = document.data.html;
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
  return changes;
}

module.exports = function(path, document, changes, finalCb) {
  if(document.document_type === 'email-thread') {
    changes.data.messages = [];
    changes.metadata.messages = [];
    for(var i = 0; i < document.metadata.messages.length; i += 1) {
      var data = document.data.messages[i];
      var metadata = document.metadata.messages[i];
      var mailDocument = {
        data: data,
        metadata: metadata
      };
      var processedChanges = {
        metadata: {},
        data: {}
      };
      processedChanges = processMail(path, mailDocument, processedChanges, function(){});
      data.html = processedChanges.data.html;
      metadata.text = processedChanges.metadata.text;
      changes.data.messages.push(data);
      changes.metadata.messages.push(metadata);
    }
    finalCb(null, changes);
  } else {
    processMail(path, document, changes, finalCb);
  }
};


