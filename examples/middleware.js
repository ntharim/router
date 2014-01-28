
var Project = require('project-model');
var ProjectPage = require('project-page');
var Router = require('router');
var User = require('user-model');
var UserPage = require('user-page');

/**
 * Setup our routes.
 */

var router = new Router()
  .on('/:user', loadUser, renderUser)
  .on('/:user/:project', loadUser, loadProject, renderProject)
  .start();

/**
 * Load a user from the server.
 *
 * @param {Function} next
 */

function loadUser (next) {
  var id = this.params.user;
  User.get(id, function (err, user) {
    if (err) return next(err);
    this.user = user;
    next();
  });
}

/**
 * Load a project from the server.
 *
 * @param {Function} next
 */

function loadProject (next) {
  var id = this.params.project;
  Project.get(id, function (err, project) {
    if (err) return next(err);
    this.project = project;
    next();
  });
}

/**
 * Render the user page.
 *
 * @param {Function} next
 */

function renderUser (next) {
  var user = this.user;
  var page = new UserPage(user);
  document.body.innerHTML = '';
  document.body.appendChild(page.el);
}

/**
 * Render the project page.
 *
 * @param {Function} next
 */

function renderProject (next) {
  var user = this.user;
  var project = this.project;
  var page = new ProjectPage(user);
  document.body.innerHTML = '';
  document.body.appendChild(page.el);
}