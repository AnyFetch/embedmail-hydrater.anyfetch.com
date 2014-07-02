'use strict';

require('should');
var anyfetchHydrater = require('anyfetch-hydrater');
var embedMailHydrater = require('../lib');

describe('Test text mail results', function() {
  it('mail from outlook web apps', function(done) {
    var document = {
      metadata: {
        text: "Salut !\nDe : buathi_q@epitech.eu\n...."
      },
      data: {},
    };

    var changes = anyfetchHydrater.defaultChanges();

    embedMailHydrater(null, document, changes, function(err, changes) {
      if (err) {
        done(new Error("It should not have an error"));
      }

      changes.should.have.property('metadata');
      changes.should.have.property('data');
      changes.metadata.should.have.property('text');
      changes.data.should.have.property('html');

      changes.metadata.text.should.containDeep('Salut !');

      done();
    });
  });

  it('mail from gmail', function(done) {
    var document = {
      metadata: {
        text: "Salut !\n---------- Forwarded message ----------\nFrom : buathi_q@epitech.eu\n...."
      },
      data: {},
    };

    var changes = anyfetchHydrater.defaultChanges();

    embedMailHydrater(null, document, changes, function(err, changes) {
      if (err) {
        done(new Error("It should not have an error"));
      }

      changes.should.have.property('metadata');
      changes.should.have.property('data');
      changes.metadata.should.have.property('text');
      changes.data.should.have.property('html');

      changes.metadata.text.should.containDeep('Salut !');

      done();
    });
  });
});

describe('Test html mail results', function() {
  it('mail from yahoo', function(done) {
    var document = {
      metadata: {
        text: "Salut !\nDe : buathi_q@epitech.eu\n...."
      },
      data: {
        html: "Salut !\n<div class=\"yahoo_quoted\">De : buathi_q@epitech.eu\n....</div>"
      },
    };

    var changes = anyfetchHydrater.defaultChanges();

    embedMailHydrater(null, document, changes, function(err, changes) {
      if (err) {
        done(new Error("It should not have an error"));
      }

      changes.should.have.property('metadata');
      changes.should.have.property('data');
      changes.metadata.should.have.property('text');

      changes.metadata.text.should.containDeep('Salut !');

      done();
    });
  });

  it('mail from gmail', function(done) {
    var document = {
      metadata: {
        text: "Salut !\n---------- Forwarded message ----------\nFrom : buathi_q@epitech.eu\n...."
      },
      data: {
        html: "Salut !\n<div class=\"gmail_extra\">---------- Forwarded message ----------\nFrom : buathi_q@epitech.eu\n....</div>"
      },
    };

    var changes = anyfetchHydrater.defaultChanges();

    embedMailHydrater(null, document, changes, function(err, changes) {
      if (err) {
        done(new Error("It should not have an error"));
      }

      changes.should.have.property('metadata');
      changes.should.have.property('data');
      changes.metadata.should.have.property('text');

      changes.metadata.text.should.containDeep('Salut !');

      done();
    });
  });
});