exports.checkUser = async function (app) {
  let uid;
  if (app.auth.isAuthenticated()) {
    app.authenticated = true; // Logout element is reliant upon a local var;
    try {
      uid = app.auth.getTokenPayload().sub;
    } catch (e) {
      app.logout();
      return Promise.resolve('bad token');
    }
    app.user = await app.appState.getUser(uid);
    if (app.user !== undefined) app.role = app.user.userType;
  }
  return Promise.resolve(true);
};

exports.checkIfLoggedIn = function (app) {
  const token = localStorage.getItem('aurelia_id_token');
  if (token !== null && token !== undefined) {
    try {
      app.auth.getTokenPayload();
      app.auth.setToken(token);
      app.authenticated = true;
      app.router.navigate('dashboard');
      return true;
    } catch (e) {
      app.logout();
      return false;
    }
  }
  return false;
};
