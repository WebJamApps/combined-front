export class AppState {
  constructor(){
    this.user = {};
    this.is_auth = false;
    this.roles = [];
  }
  
  getUser(){
    console.log('appState');
    console.log(this.user);
    return this.user;
  }
  setUser(input){
    console.log('appState');
    console.log(this.user);
    this.user = input;
  }
  
  getAuth(){
    return (this.is_auth);
  }
  
  setAuth(input){
    this.is_auth = input;
  }
  
  getRoles(){
    return (this.roles);
  }
  
  setRoles(input){
    this.roles = input;
  }
}
