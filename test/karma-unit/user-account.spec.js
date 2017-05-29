import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock} from './commons';
import {App} from '../../src/app';
describe('the UserAccount Module', () => {
  let ua;
  beforeEach(() => {
    ua = new UserAccount(AuthStub, App, HttpMock);
  });

  it('checks deletes the user', (done) => {
    ua.deleteUser();
    //expect(typeof home.widescreen).toBe('boolean');
    done();
  });
});
