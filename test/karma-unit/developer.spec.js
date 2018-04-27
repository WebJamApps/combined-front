import { Developer } from '../../src/dashboard-child-routes/developer';
import { App } from '../../src/app';
import { AuthStub, HttpMock, AppStateStub } from './commons';

class HttpMockDev extends HttpMock {
  fetch(url, obj) {
    // console.log(url);
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([])
    });
  }
}

describe('the Developer Module', () => {
  let developer;
  let auth;
  let app;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: '1' });
    app = new App(auth, new HttpMockDev());
    app.activate();
    developer = new Developer(app);
    developer.app.appState = new AppStateStub();
  });

  it('activates', (done) => {
    developer.activate();
    done();
  });
});
