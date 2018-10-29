// const sinon = require('sinon');
const dashboardUtils = require('../../src/commons/dashboardUtils');
// const showSlides = require('../../src/commons/showSlides');

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
  // beforeEach((done) => {
  //   jest.useFakeTimers();
  //   done();
  // });
  it('allows routing', async () => {
    let res;
    try {
      res = await dashboardUtils.subRoute(dashboardStub, lsStub);
    } catch (e) { throw e; }
  });
  // it('makes a tab delimted text file', async () => {
  //   let cb;
  //   const fMock = sinon.mock(filesaver);
  //   fMock.expects('saveAs').resolves(true);
  //   try {
  //     cb = await utils.makeCSVfile({ fetch() { return Promise.resolve({ json() { return Promise.resolve({}); } }); } }, '', '');
  //     expect(cb).toBe(true);
  //   } catch (e) { throw e; }
  //   fMock.restore();
  // });
});
