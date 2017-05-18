export class AppState {
  constructor(httpClient) {
    this.httpClient = httpClient;
    this.user = {};
    this.is_auth = false;
    this.roles = [];
  }

  getUserID() {
    return this.user._id;
  }

  getUser(uid) {
    console.log('appState getUser');
    if (this.getUserID() !== undefined) {
      console.log('appState returning already set user');
      return new Promise((resolve) => {
        resolve(this.user);
      });
    }
    console.log('appState getting new user');
    return this.httpClient.fetch('/user/' + uid)
    .then(response => response.json())
    .then(data => {
      let user = data;
      this.setUser(user);
      this.checkUserRole();
    });
  }

  checkUserRole(){
    if (this.user.userType !== 'Developer'){
      this.setRoles([toLowerCase(this.user.userType)]);
    } else {
      this.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
      //this.app.router.navigate('dashboard/developer');
    }
  }

  setUser(input) {
    console.log('appState setUser');
    console.log(this.user);
    this.user = input;
  }

  getAuth() {
    return (this.is_auth);
  }

  setAuth(input) {
    this.is_auth = input;
  }

  getRoles() {
    return new Promise((resolve) => {
      resolve(this.roles);
    });
  }

  setRoles(input){
    this.roles = input;
    console.log('user roles are ' + this.roles);
  }
}
