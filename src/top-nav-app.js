import {PLATFORM} from 'aurelia-pal';

export class TopNavApp {
  configureRouter(config, router) {
    config.title = 'Web Jam LLC';
    config.map([
      { route: ['welcome', 'welcome'], name: 'welcome',      moduleId: PLATFORM.moduleName('./welcome'),      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: PLATFORM.moduleName('./users'),        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: PLATFORM.moduleName('./child-router'), nav: true, title: 'Child Router' },
      { route: '',  name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: false, title: 'Web Jam LLC' }
    ]);
    
    this.router = router;
  }
}
