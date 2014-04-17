
var history = require('history');
var querystring = require('node-querystring');


/**
 * Expose `Context`.
 */

module.exports = Context;


/**
 * Initialize a new `Context`.
 *
 * @param {String} path
 */

function Context (path) {
  path = path || '';
  this.path = path.split('?')[0];
  this.params = [];
  this.state = history.state() || {};
  this.query = path.indexOf('?')
    ? querystring.parse(path.split('?')[1])
    : {};
}