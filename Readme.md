# router

  A nice client-side router.

## Installation

    $ component install Ntran013/router

## Example

Simple example:

```js
var db = require('db');
var Router = require('router');

var router = new Router()
  .on('/:user', user, renderUser)
  .on('/:user/:repo', user, repo, renderRepo)
  .start();

function user (next) {
  var id = this.params.user;
  var user = db.users.get(id);
  this.user = user;
  next();
}

function repo (next) {
  var id = this.params.repo;
  var repo = db.users.get(id);
  this.repo = repo;
  next();
}

function renderUser (next) {
  var user = this.user;
  render(user);
}

function renderRepo (next) {
  var user = this.user;
  var repo = this.repo;
  render(user, repo);
}
```

Check the [`examples`](/examples) folder for the some more complicated examples.

## API

### #on(path, middleware...)
  Bind `middleware` functions to a `path`. Middleware take `next` callbacks to move to the next middleware on the queue.

### #in(middleware...)
  Add "in" transition `middleware` that will be executed when a route is matched. This is equivalent to passing middleware to `#on`. You have to call `#on` first before calling `#in`.

### #out(middleware...)
  Add "out" transition `middleware` that will be executed when the route is being "torn down" and another route is matched. You have to call `#on` first before calling `#out`.

### #start()
  Start the router, dispatching the current URL. (Convenience so you don't have to call `#dispatch(window.location...` yourself.)

### #listen(path)
  Start and listen for link clicks that the router should handle, optionally namespaced by a `path`. This means that you don't need to `.preventDefault` clicks by hand on `a[href]`'s since the router will do it for you for internal links.

### #go(path, [state])
  Dispatch to a `path` and push it onto the history with an optional `state` object.
  
### #dispatch(path)
  Trigger middleware for a `path`.

### #push(path, [state])
  Push a `path` onto the history, with an optional `state` object.

### #replace(path, [state])
  Replace the current URL in the history with a new `path`, with an optional `state` object.

### .use(plugin)
  Use the given `plugin`.

## License

  MIT
