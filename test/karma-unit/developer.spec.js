import {Developer} from '../../src/dashboard-child-routes/developer';
import {App} from '../../src/app';
import {AuthStub} from './commons';

describe('the Developer Module', () => {
  let developer;
  beforeEach(() => {
    developer = new Developer(AuthStub, App);
  });

  it('activates', done => {
    developer.activate();
    done();
  });
});
