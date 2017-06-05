import {FormValidator} from '../../src/classes/FormValidator';
describe('the FormValidator class', () => {
  let fv;
  let validator = function(rules, rule){
    // do nothing
  };
  beforeEach(() => {
    fv = new FormValidator(validator, null);
    //app1.auth.setToken('No token');
    //app2 = new App(new AuthStub2(), new HttpMock());
  });

  it('run a ruleExists function', (done) => {
    fv.ruleExists();
    done();
  });
});
