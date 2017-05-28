// this are unit tests for the AppState

import {AppState} from '../../src/classes/AppState.js';
import {HttpMock} from './commons';

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

describe('The AppState module unit tests', () => {
  let appState;
  //let auth = '12345678agdgfhjajsagj';
  let roles = ['developer', 'Volunteer'];
  let user = {'userName': 'John Doe', '_id': 'foo'};
  let userDeveloper = {'userName': 'John Doe', '_id': 'foo', 'userType': 'Developer'};

  beforeEach(() => {
    appState = new AppState(new HttpMock);
  });

  it('should set and then get the corresponding value of the user', (done) => {
    appState.setUser(user);
    appState.getUser('foo').then((returnedUser) => {
      expect(returnedUser).toEqual(user);
      done();
    });
  });

  it('should set all the roles for the developer', testAsync(async function() {
    await appState.setUser(userDeveloper);
    await appState.checkUserRole();
    let devroles = await appState.getRoles();
    expect(devroles).toContain('developer');
    //done();
  }));

  it('should set and get values for the roles', (done) => {
    appState.setRoles(roles);
    let returnedRoles = appState.getRoles();
    returnedRoles.then((userRoles) => {
      expect(userRoles).toBe(roles);
      expect(returnedRoles.isFulfilled()).toBeTruthy();
      done();
    });
  });
});
