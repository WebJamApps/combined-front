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
volStub.commonUtils = {
  formatDate() {
    return '20181104';
  }
};
docStub = {
  getElementsByClassName() {
    return [{
      innerHTML: ''
    }];
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
  it('double checks signups but date is past', async () => {
    volStub.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json() {
          return Promise.resolve({
            voStartDate: '2018-10-31'
          });
        }
      });
    };
    let res;
    try {
      res = await ohafUtils.doubleCheckSignups({}, volStub, docStub);
      expect(res).toBe(false);
    } catch (e) {
      throw e;
    }
  });
  it('double checks signups but max people were reached', async () => {
    volStub.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json() {
          return Promise.resolve({
            voStartDate: '2018-11-31',
            voPeopleScheduled: ['123', '456'],
            voNumPeopleNeeded: 1
          });
        }
      });
    };
    let res;
    try {
      res = await ohafUtils.doubleCheckSignups({}, volStub, docStub);
      expect(res).toBe(false);
    } catch (e) {
      throw e;
    }
  });
  it('double checks signups successfully', async () => {
    volStub.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json() {
          return Promise.resolve({
            voStartDate: '2018-11-31',
            voPeopleScheduled: ['123', '456'],
            voNumPeopleNeeded: 3
          });
        }
      });
    };
    let res;
    try {
      res = await ohafUtils.doubleCheckSignups({}, volStub, docStub);
      expect(res).toBe(true);
    } catch (e) {
      throw e;
    }
  });
  // it('tries to signup, but cannot', async () => {
  //
  // });
});
