import {AppState} from '../../src/classes/AppState.js';
import {UserAccess} from '../../src/classes/UserAccess.js';

describe('The UserAccess module unit tests', () => {
  let appState;
  let routingContext = {'params': {'childRoute': 'user-account'}};
  let roles = ['foo', 'charity'];
  let userAccess;
  let next;

  beforeEach(() => {
    appState = new AppState();
    appState.setRoles(roles);
    userAccess = new UserAccess(appState);
  });

  it('should not require authentication', (done) => {
    next = function() {
      done();
    };
    routingContext.config = {auth: false};
    userAccess.run(routingContext, next);
  });

  it('should require auth, but requested dashboard, so do not check role', (done) => {
    next = function() {
      done();
    };
    routingContext.config = {auth: true};
    routingContext.fragment = '/dashboard';
    userAccess.run(routingContext, next);
  });

  it('should require auth, but when child route is user-account do not check role', (done) => {
    next = function() {
      done();
    };
    routingContext.config = {auth: true};
    routingContext.fragment = '';
    routingContext.params.childRoute = 'user-account';
    userAccess.run(routingContext, next);
  });

  // it('should require auth, but requested librarian, so do not check role', done => {
  //   next = function() {
  //     done();
  //   };
  //   routingContext.config = {auth: true};
  //   routingContext.fragment = '/dashboard/librarian';
  //   routingContext.params = {childRoute: 'librarian'};
  //   userAccess.run(routingContext, next);
  // });

  // it('should require auth, but requested reader, so do not check role', done => {
  //   next = function() {
  //     done();
  //   };
  //   routingContext.config = {auth: true};
  //   routingContext.fragment = '/dashboard/reader';
  //   routingContext.params = {childRoute: 'reader'};
  //   userAccess.run(routingContext, next);
  // });

  it('should require auth and check roles and be authorized', (done) => {
    next = function() {
      done();
    };
    routingContext.config = {auth: true};
    routingContext.fragment = '/dashboard/foo';
    routingContext.params = {childRoute: 'foo'};
    userAccess.run(routingContext, next);
  });

  it('should allow charity role to schedule events', (done) => {
    next = function() {
      done();
    };
    routingContext.config = {auth: true};
    routingContext.fragment = '/dashboard/vol-ops/599c17ffed5a5716af47f51d';
    routingContext.params = {childRoute: 'vol-ops/599c17ffed5a5716af47f51d'};
    userAccess.run(routingContext, next);
  });

  it('should require auth and cancel because not authorized', (done) => {
    next = {cancel: function() { done(); }};
    routingContext.config = {auth: true};
    routingContext.fragment = '/dashboard/bar';
    routingContext.params = {childRoute: 'bar'};
    userAccess.run(routingContext, next);
  });
});
