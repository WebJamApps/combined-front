import { PLATFORM } from 'aurelia-pal';

export class ChildRouter {
  heading = 'Child Router';
  
  configureRouter(config, router) {
    config.map([
      { route: ['welcome', 'welcome'], name: 'welcome',      moduleId: PLATFORM.moduleName('./welcome'),      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: PLATFORM.moduleName('./users'),        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: PLATFORM.moduleName('./child-router'), nav: true, title: 'Child Router' },
      { route: '',  name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: true, title: 'Web Jam LLC' }
    ]);
    
    this.router = router;
  }
}
