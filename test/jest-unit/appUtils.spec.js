const au = require('../../src/commons/appUtils');


describe('the appUtils', () => {
  it('checks for an authenticated user but has error on get token payload', async () => {
    try {
      cb = await au.checkUser({ logout() {}, auth: { isAuthenticated() { return true; } } });
      expect(cb).toBe('bad token');
    } catch (e) { throw e; }
  });
  it('assigned the role of an authenticated user', async () => {
    try {
      cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() { return true; },
          getTokenPayload() { return { sub: '123' }; }
        },
        appState: { getUser() { return { usertype: 'charity' }; } }
      });
      expect(cb).toBe(true);
    } catch (e) { throw e; }
  });
  it('does nothing is user is not authenticated', async () => {
    try {
      cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() { return false; },
          getTokenPayload() { return { sub: '123' }; }
        },
        appState: { getUser() { return { usertype: 'charity' }; } }
      });
      expect(cb).toBe(true);
    } catch (e) { throw e; }
  });
  it('does nothing is user is not defined', async () => {
    try {
      cb = await au.checkUser({
        logout() {},
        auth: {
          isAuthenticated() { return true; },
          getTokenPayload() { return { sub: '123' }; }
        },
        appState: { getUser() { return Promise.resolve(); } }
      });
      expect(cb).toBe(true);
    } catch (e) { throw e; }
  });
});
