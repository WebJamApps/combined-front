import {Charity} from '../../src/dashboard-child-routes/charity';
import {App} from '../../src/app';
import {AuthStub} from './commons';

describe('the Charity Module', () => {
  let charity;
  beforeEach(() => {
    charity = new Charity(AuthStub, App);
  });

  it('activates', done => {
    charity.activate();
    done();
  });
});
