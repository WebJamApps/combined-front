import { AppState } from '../../src/classes/AppState';
import { UserAccess } from '../../src/classes/UserAccess';

describe('The UserAccess module unit tests', () => {
  const routingContext = { params: { childRoute: 'user-account' } };
  const roles = ['foo', 'charity'];
  let appState, userAccess, next;
  beforeEach(() => {
    appState = new AppState();
    appState.setRoles(roles);
    userAccess = new UserAccess(appState);
  });
  it('should not require authentication', (done) => {
    next = function next() {
      done();
    };
    routingContext.config = { auth: false };
    userAccess.run(routingContext, next);
  });
  it('should require auth, but requested dashboard, so do not check role', (done) => {
    next = function next() {
      done();
    };
    routingContext.config = { auth: true };
    routingContext.fragment = '/dashboard';
    userAccess.run(routingContext, next);
  });

  it('should require auth, but when child route is user-account do not check role', (done) => {
    next = function next() {
      done();
    };
    routingContext.config = { auth: true };
    routingContext.fragment = '';
    routingContext.params.childRoute = 'user-account';
    userAccess.run(routingContext, next);
  });

  it('should require auth and check roles and be authorized', (done) => {
    next = function next() {
      done();
    };
    routingContext.config = { auth: true };
    routingContext.fragment = '/dashboard/foo';
    routingContext.params = { childRoute: 'foo' };
    userAccess.run(routingContext, next);
  });

  it('should allow charity role to schedule events', (done) => {
    next = function next() {
      done();
    };
    routingContext.config = { auth: true };
    routingContext.fragment = '/dashboard/vol-ops/599c17ffed5a5716af47f51d';
    routingContext.params = { childRoute: 'vol-ops/599c17ffed5a5716af47f51d' };
    userAccess.run(routingContext, next);
  });

  it('should require auth and cancel because not authorized', (done) => {
    next = { cancel() { done(); } };
    routingContext.config = { auth: true };
    routingContext.fragment = '/dashboard/bar';
    routingContext.params = { childRoute: 'bar' };
    userAccess.run(routingContext, next);
  });
});
