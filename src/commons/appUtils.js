exports.checkUser = async function (app) {
  let uid;
  if (app.auth.isAuthenticated()) {
    app.authenticated = true; // Logout element is reliant upon a local var;
    try {
      uid = app.auth.getTokenPayload().sub;
    } catch (e) {
      app.logout();
      return Promise.resolve();
    }
    app.user = await app.appState.getUser(uid);
    if (app.user !== undefined) app.role = app.user.userType;
  }
  return Promise.resolve();
};
