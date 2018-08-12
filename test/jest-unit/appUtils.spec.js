const au = require('../../src/commons/appUtils');


describe('the appUtils', () => {
  it('checks for an authenticated user but has error on get token payload on checkUser', async () => {
    try {
      cb = await au.checkUser({ logout() {}, auth: { isAuthenticated() { return true; } } });
      expect(cb).toBe('bad token');
    } catch (e) { throw e; }
  });
  it('assigned the role of an authenticated user on checkUser', async () => {
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
  it('does nothing is user is not authenticated on checkUser', async () => {
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
  it('does nothing if token is null', (done) => {
    window.localStorage = {
      getItem(key) {
        expect(key).toBe('aurelia_id_token');
        return null;
      }
    };
    const cb = au.checkIfLoggedIn();
    expect(cb).toBe(false);
    done();
  });
  it('logs out if token is invalid', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    const cb = au.checkIfLoggedIn({ logout() {}, auth: { getTokenPayload() { return Promise.reject(new Error('bad token')); } } });
    expect(cb).toBe(false);
    done();
  });
  it('navigates to dashboard if token is good', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    const cb = au.checkIfLoggedIn({ router: { navigate() {} }, logout() {}, auth: { getTokenPayload() { return true; }, setToken() {} } });
    expect(cb).toBe(true);
    done();
  });
  it('does nothing is user is not defined on checkUser', async () => {
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
