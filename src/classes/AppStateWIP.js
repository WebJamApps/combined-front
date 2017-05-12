export class AppState {
  constructor(){
    this.user = {};
    this.is_auth = false;
    this.roles = [];
  }

  getUser() {
    console.log('appState getUser');
    console.log(this.user);
    return this.user;
  }
  setUser(input) {
    console.log('appState currently contains');
    console.log(this.user);
    this.user = input;
    console.log('and appState now contains');
    console.log(this.user);
  }

  getAuth() {
    return (this.is_auth);
  }

  setAuth(input) {
    this.is_auth = input;
  }

  getRoles() {
    return new Promise((resolve, reject) => {
      if (this.roles !== []){
        resolve(this.roles);
      } else {
        reject();
      }
    });
  }

  setRoles(input){
    this.roles = input;
  }
}
