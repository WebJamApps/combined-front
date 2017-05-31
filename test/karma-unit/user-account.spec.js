import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock} from './commons';
import {App} from '../../src/app';
describe('the UserAccount Module', () => {
  let ua;
  beforeEach(() => {
    ua = new UserAccount(new AuthStub(), new App(), new HttpMock());
  });

  it('should activate user account', (done) => {
    ua.activate();
    done();
  });

  it('checks deletes the user', (done) => {
    ua.deleteUser();
    //expect(typeof home.widescreen).toBe('boolean');
    done();
  });
});
