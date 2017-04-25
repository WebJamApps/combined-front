import {inject} from 'aurelia-framework';
import {AppState} from '../classes/AppState.js';

@inject(AppState)
export class UserAccess {
  constructor(appState){
    this.appState = appState;
  }
  
  run(routingContext, next) {
    console.log('Hey, I am trying to stop peoples');
    //const currentUser = this.appState.getUser();
    //console.log(currentUser);
    //console.log(routingContext);
    //console.log(this.appState.getRoles());
    // if (routingContext.fragment === '/dashboard'){// && routingContext.config.auth && this.appState.getAuth()){
    //   return next();
    // }
    // if we need to authenticate / authorize, verify the logged in users roles here.
    if (routingContext.config.auth){
      console.log('I am entering a route that requires auth');
      const tempRoles = this.appState.getRoles(); //TODO: Be sure that the roles have been set.
      console.log('These are my roles: ' + tempRoles);
      console.log('The main route is: ' + routingContext.fragment);
      
      if (routingContext.fragment === '/dashboard'){
        console.log('I am only trying to go to the main dashboard');
        return next();
      }
      
      console.log('The child route is: ' + routingContext.params.childRoute);
      if (routingContext.params.childRoute === 'reader'){
        return next();
      }
      
      if (routingContext.params.childRoute === 'librarian'){
        return next();
      }
      
      for (let i = 0; i < tempRoles.length; i++) {
        // in this case the user is only in one role at a time.
        if (routingContext.params.childRoute === tempRoles[i].toLowerCase()){
          console.log('YAY! authorized.');
          //routingContext.getAllInstructions();
          return next();
          // } else if (tempRoles[i].toLowerCase() === 'dashboard' ){
          //   //routingContext.getAllInstructions();
          //return next();
          // } else if (routingContext.params.childRoute === undefined) {
          //   return next();
        }
      }
      return next.cancel();
    }
    console.log('this route does not require auth, so let them go through');
    return next();
  }
}
//log.warning('not authorized');
// console.log('I should be rejecting access by the time I get here');
// console.log(routingContext.params.childRoute);
// //return next.cancel();
// // } else if (routingContext.config.auth){
// //   return next(); //TODO: Double check that this does send this to dashboard\
// //   //If not, make sure to change the routing context into dashboard
// // } else {
// return next.cancel();

//     if (!this.appState.is_auth){
//       console.log('I did not get auth nor roles, so everybody is all good');
//       return next();
//     }
//     //routingContext.getAllInstructions();
