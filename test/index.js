
describe('Router', function () {

  var assert = require('assert');
  var history = require('history');
  var noop = function(){};
  var Router = require('router');
  var trigger = require('trigger-event');

  afterEach(function () {
    history.replace('/');
  });

  it('should bind to popstate', function (done) {
    history.push('/popstate-one', {}); // empty state object
    history.push('/popstate-two', {}); // to fix initial popstate in Webkit
    new Router()
      .on('/popstate-one', function () {
        done();
      })
      .bind();
    history.back();
  });

  describe('#use', function () {
    it('should be pluggable', function (done) {
      var router = new Router();
      router.use(function (r) {
        assert(router === r);
        done();
      });
    });
  });

  describe('#context', function () {
    it('should return a context', function () {
      var router = new Router();
      var context = router.context();
      assert(context instanceof Router.Context);
    });

    it('should add the previous context', function () {
      var router = new Router();
      var previous = router.context();
      var context = router.context();
      assert(context.previous == previous);
    });
  });

  describe('#push', function () {
    it('should push path to history', function () {
      var router = new Router().push('/push');
      assert('/push' == history.path());
      assert(isEmpty(history.state()) === true);
    });

    it('should push state to history', function () {
      var router = new Router().push('/push', { state: 'push' });
      assert('push' == history.state().state);
    });
  });

  describe('#replace', function () {
    it('should replace history', function () {
      var router = new Router().replace('/replace');
      assert('/replace' == history.path());
      assert(isEmpty(history.state()) === true);
    });

    it('should replace state in history', function () {
      var router = new Router().replace('/replace', { state: 'replace' });
      assert('replace' == history.state().state);
    });
  });

  describe('#dispatch', function () {
    it('should match the right route', function (done) {
      var router = new Router()
        .on('/one', function (next) {
          assert(false); next();
        })
        .on('/two', function () {
          done();
        })
        .dispatch('/two');
    });

    it('should match params', function (done) {
      var router = new Router()
        .on('/route/:one/:two', function () {
          assert(2 == this.params.length);
          assert('1' == this.params[0]);
          assert('1' == this.params.one);
          assert('2' == this.params[1]);
          assert('2' == this.params.two);
          done();
        })
        .dispatch('/route/1/2');
    });

    it('should match asterisks', function (done) {
      var router = new Router()
        .on('/route/*/*', function () {
          assert(2 === this.params.length);
          assert('1' === this.params[0]);
          assert('2' === this.params[1]);
          done();
        })
        .dispatch('/route/1/2');
    });

    it('should match params and asterisks', function (done) {
      var router = new Router()
        .on('/route/:param/*', function () {
          assert(2 === this.params.length);
          assert('param' === this.params.param);
          assert('param' === this.params[0]);
          assert('asterisk' === this.params[1]);
          done();
        })
        .dispatch('/route/param/asterisk');
    });

    it('should pass a next callback', function (done) {
      var router = new Router()
        .on('/route',
          function (next) {
            this.user = 'user';
            next(); 
          },
          function (next) {
            assert('user' === this.user);
            this.user = 'not_user';
            next(); 
          },
          function () {
            assert('not_user' === this.user);
            done(); 
          }
        )
        .dispatch('/route');
    });

    it('should auto-next callbacks with single arity', function (done) {
      var router = new Router()
        .on('/route', noop, function () { done(); })
        .dispatch('/route');
    });

    it('should call in middleware', function (done) {
      new Router()
        .on('/route')
        .in(function () {
          assert(this.path === '/route');
          done();
        })
        .dispatch('/route');
    });

    it('should call out middleware', function (done) {
      var i = 0;
      var router = new Router()
        .on('/route')
        .in(function () {
          assert(this.path === '/route');
          i++;
        })
        .out(function () {
          assert(this.path === '/route');
          assert(i === 1);
          done();
        })
        .dispatch('/route')
        .dispatch('/another');
    });
  });

  describe('#go', function () {
    it('should push and dispatch a path', function (done) {
      var router = new Router()
        .on('/route', function () {
          assert('/route' == history.path());
          assert('state' == history.state().state);
          done();
        })
        .go('/route', { state: 'state' });
    });

    it('should default to the current path', function (done) {
      var router = new Router()
        .replace('/route')
        .on('/route', function () { done(); })
        .go();
    });

    it('should add the querystring', function (done) {
      new Router()
        .replace('/route?key=value')
        .on('/route', function () {
          assert('value' == this.query.key);
          done();
        })
        .go();
    });
  });

  describe('#start', function () {
    it('should be an alias for #go', function () {
      assert(Router.prototype.start == Router.prototype.go);
    });
  });

  describe('#listen', function () {
    it('should go and listen clicks', function (done) {
      var i = 0;
      var router = new Router()
        .push('/start')
        .on('/start', function () {
          i++;
        })
        .on('/link', function () {
          assert(1 == i);
          done();
        })
        .listen();
      trigger(document.getElementById('link'), 'click');
    });
  });

});

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}