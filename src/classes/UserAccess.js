export class UserAccess {
  constructor(appState){
    this.appState = appState;
  }

  run(routingContext, next) {
    // if we need to authenticate / authorize, verify the logged in users roles here.
    return this.appState.getRoles().then((userRoles)=>{
      if (routingContext.config.auth){
        console.log('I am entering a route that requires auth');
        console.log('These are my roles: ' + userRoles);
        console.log('The main route is: ' + routingContext.fragment);

        if (routingContext.fragment === '/dashboard'){
          console.log('I am only trying to go to the main dashboard');
          return next();
        }

        console.log('The child route is: ' + routingContext.params.childRoute);
        // if (routingContext.params.childRoute === 'reader'){
        //   return next();
        // }
        //
        // if (routingContext.params.childRoute === 'librarian'){
        //   return next();
        // }
        //
        // if (routingContext.params.childRoute === 'charity'){
        //   return next();
        // }
        //
        // if (routingContext.params.childRoute === 'volunteer'){
        //   return next();
        // }
        //
        // if (routingContext.params.childRoute === 'developer'){
        //   return next();
        // }

        for (let i = 0; i < userRoles.length; i++) {
          // in this case the user is only in one role at a time.
          if (routingContext.params.childRoute === userRoles[i].toLowerCase()){
            console.log('YAY! authorized.');
            //routingContext.getAllInstructions();
            return next();
          }
        }
        return next.cancel();
      }
      console.log('this route does not require auth, so let them go through');
      return next();
    });
  }
}
