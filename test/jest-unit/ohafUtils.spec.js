const ohafUtils = require('../../src/commons/ohafUtils');

const volStub = {
  app: {
    httpClient: {
      fetch() {
        return Promise.resolve({
          json() {
            return Promise.resolve({});
          }
        });
      }
    }
  }
};
docStub = {
  getElementsByClassName() {
    return [];
  }
};
describe('the ohaf utils module', () => {
  it('double checks signups', async () => {
    try {
      await ohafUtils.doubleCheckSignups({}, volStub, docStub);
    } catch (e) {
      throw e;
    }
  });
  it('catches error on double checks signups', async () => {
    volStub.app.httpClient.fetch = function fetch() {
      return Promise.reject(new Error('bad'));
    };
    try {
      await ohafUtils.doubleCheckSignups({}, volStub, docStub);
    } catch (e) {
      expect(e.message).toBe('bad');
    }
  });
});
