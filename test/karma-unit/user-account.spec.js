import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock} from './commons';
import {App} from '../../src/app';
describe('the UserAccount Module', () => {
  let ua;
  let app = new App(new AuthStub(), new HttpMock());
  beforeEach(() => {
    ua = new UserAccount(app);
  });

  it('should activate user account', (done) => {
    ua.activate();
    done();
  });

  it('deletes the user', (done) => {
    ua.deleteUser();
    done();
  });
});
