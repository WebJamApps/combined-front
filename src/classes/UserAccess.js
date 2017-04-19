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
    if (routingContext.config.auth && this.appState.getRoles().length > 0){
      console.log('I am authing and have roles');
      const tempRoles = this.appState.getRoles(); //TODO: Be sure that the roles have been set.
      for (let i = 0; i < tempRoles.length; i++) {
        // in this case the user is only in one role at a time.
        if (routingContext.params.childRoute === tempRoles[i].toLowerCase()){
          console.log('YAY! authorized.');
          //routingContext.getAllInstructions();
          return next();
        } else if (tempRoles[i].toLowerCase() === 'dashboard' ){
          //routingContext.getAllInstructions();
          return next();
        }
      }
      
      //log.warning('not authorized');
      console.log('I should be rejecting access by the time I get here');
      //return next.cancel();
      // } else if (routingContext.config.auth){
      //   return next(); //TODO: Double check that this does send this to dashboard\
      //   //If not, make sure to change the routing context into dashboard
      // } else {
      return next.cancel();
    }
    
    console.log('I did not get auth nor roles, so everybody is all good');
    //routingContext.getAllInstructions();
    return next();
  }
}
