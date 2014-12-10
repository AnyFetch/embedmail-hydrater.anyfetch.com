'use strict';

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var config = require('../config/configuration.js');

function htmlReplace(str) {
  return entities.decode(str
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<blockquote([\s\S]*<\/blockquote>)+/g, '') // TODO: replace by talon: https://github.com/mailgun/talon/
    .replace(/<\/?[^>]+\/?>/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .trim());
}

function processMail(path, document, changes) {
  document.data = document.data || {};
  document.metadata = document.metadata || {};

  if(!document.data.html && document.metadata.text) {
    changes.data.html = document.metadata.text.replace(/\n/g, '<br/>\n');
    changes.metadata.text = document.metadata.text;
  }
  else if(!document.metadata.text && document.data.html) {
    var unquotedText = document.data.html.replace(/<blockquote[\s\S]*<\/blockquote>/g, ''); // DIRTY: https://github.com/mailgun/talon
    changes.metadata.text = htmlReplace(unquotedText);
    changes.data.html = unquotedText;
  }

  changes.metadata.text = (changes.metadata.text) ? changes.metadata.text : htmlReplace(document.metadata.text || '');

  if(changes.data.html) {
    config.separators.html.forEach(function(separator) {
      var tmpHTML = changes.data.html.split(separator)[0];

      if(tmpHTML !== changes.data.html) {
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

  return changes;
}

module.exports = function processEmailOrThread(path, document, changes, cb) {
  if(document.document_type === 'email-thread') {
    changes.data.messages = [];
    changes.metadata.messages = [];
    for(var i = 0; i < document.metadata.messages.length; i += 1) {
      var data = document.data.messages[i] || {};
      var metadata = document.metadata.messages[i] || {};

      var mailDocument = {
        data: data,
        metadata: metadata
      };

      var processedChanges = {
        metadata: {},
        data: {}
      };

      processedChanges = processMail(path, mailDocument, processedChanges, function() {});

      data.html = processedChanges.data.html || mailDocument.data.html;
      metadata.text = processedChanges.metadata.text || mailDocument.metadata.text;

      changes.data.messages.push(data);
      changes.metadata.messages.push(metadata);
    }
    cb(null, changes);
  } else {
    cb(null, processMail(path, document, changes, cb));
  }
};


