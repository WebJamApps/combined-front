import { FormValidator } from '../../src/classes/FormValidator';

describe('the FormValidator class', () => {
  let fv;
  const validator = function () {
    // console.log(rule);
    // do nothing
  };
  beforeEach(() => {
    fv = new FormValidator(validator, null);
    // app1.auth.setToken('No token');
    // app2 = new App(new AuthStub2(), new HttpMock());
  });

  it('run a ruleExists function', (done) => {
    fv.ruleExists();
    done();
  });

  it('prevents the enter key', (done) => {
    // charity.activate();
    const e = { keyCode: 13, preventDefault() {} };
    fv.preventEnter(e);
    // expect(charity2.charities.length).toBe(0);
    done();
  });

  it('does not prevent other events', (done) => {
    // charity.activate();
    const e = { keyCode: 12, preventDefault() {} };
    fv.preventEnter(e);
    // expect(charity2.charities.length).toBe(0);
    done();
  });
});
