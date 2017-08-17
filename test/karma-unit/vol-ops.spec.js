import {VolunteerOpps} from '../../src/dashboard-child-routes/vol-ops';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';
import {Validator} from 'aurelia-validation';

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  validateObject(obj, rules) {
    console.log('obj');
    console.log(obj);
    if (obj.charityTypes.indexOf('True') > -1){
      return Promise.resolve([{rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: true, message: 'Charity Phone Number is correct'}]);
    }
    return Promise.resolve([{rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: false, message: 'Charity Phone Number is not correct'}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}
describe('the Volunteer Opps Module', () => {
  let app;
  let auth;
  let volops;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpMock());
    volops = new VolunteerOpps(app, new VCMock(), new ValidatorMock());
    volops.app.appState = new AppStateStub();
  });

  it('activates', (done) => {
    volops.activate();
    done();
  });
});
