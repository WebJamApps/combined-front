// const jsdom = require('jsdom');
const au = require('../../src/commons/appUtils');

// const { JSDOM } = jsdom;
// const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
// global.window = dom.window;
// global.document = dom.window.document;
// const resizeEvent = document.createEvent('Event');
// resizeEvent.initEvent('resize', true, true);
// global.window.resizeTo = (width, height) => {
//   global.window.innerWidth = width || global.window.innerWidth;
//   global.window.innerHeight = height || global.window.innerHeight;
//   global.window.dispatchEvent(resizeEvent);
// };

describe('the appUtils', () => {
  it('checks for an authenticated user but has error on get token payload on checkUser', async () => {
    try {
      const cb = await au.checkUser({ logout() {}, auth: { isAuthenticated() { return true; } } });
      expect(cb).toBe('bad token');
    } catch (e) { throw e; }
  });
  it('assigned the role of an authenticated user on checkUser', async () => {
    try {
      const cb = await au.checkUser({
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
      const cb = await au.checkUser({
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
      const cb = await au.checkUser({
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
  it('checks if widescreen and returns false', (done) => {
    // global.window.innerWidth = 500;
    // global.window.dispatchEvent(new Event('resize'));
    // console.log(document.documentElement.clientWidth);
    const app = { menuToggled: false };
    const cb = au.checkIfWidescreen(app);
    expect(cb).toBe(false);
    done();
  });
  // it('checks if widescreen and returns true', (done) => {
  //   global.window.innerWidth = 800;
  //   global.window.dispatchEvent(new Event('resize'));
  //   const app = { menuToggled: false };
  //   const cb = au.checkIfWidescreen(app);
  //   expect(cb).toBe(true);
  //   done();
  // });
});
