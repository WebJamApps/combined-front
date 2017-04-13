// this are unit tests for the AppState

import {AppState} from '../../src/classes/AppState.js';

describe('The AppState module unit tests', () => {

    let appState,
        auth = "12345678agdgfhjajsagj",
        role = ["developer", "Volunteer"],
        user = "John Doe";

    beforeEach(() => {
        appState = new AppState();
    });

    it ('should set and then get the corresponding value of the user', done => {
        appState.setUser(user);
        expect(appState.getUser()).toBe(user);
        done();
    });

    it ("should set and get the value for the auth", done => {
        appState.setAuth(auth);
        expect(appState.getAuth()).toBe(auth);
        done();
    });

    it ('should set and get values for the roles', done => {
        appState.setRoles(role);
        expect(appState.getRoles()).toBe(role);
        done();
    })
})
