const dashboardUtils = require('../../src/commons/dashboardUtils');

const dashboardStub = {
  uid: '',
  app: { auth: { getTokenPayload() { return { sub: '123' }; } },
    appState: { getUser() { return { email: 'jb@jb.com', userType: 'Reader' }; } },
    router: { navigate() {} }
  }
};

const lsStub = {
  setItem() {}
};

describe('the dashboard utils', () => {
  it('allows routing', async () => {
    let res;
    try {
      res = await dashboardUtils.subRoute(dashboardStub, lsStub);
    } catch (e) { throw e; }
  });
});
