import {PLATFORM} from 'aurelia-pal';

export class App {
  configureRouter(config, router) {
    config.title = 'Web Jam LLC';
    config.map([
      { route: ['', 'music'], name: 'music',      moduleId: PLATFORM.moduleName('./music'),      nav: true, title: 'Music' },
      { route: 'sc2rs',         name: 'sc2rs',        moduleId: PLATFORM.moduleName('./sc2rs'),        nav: true, title: 'SC2RS' },
      { route: 'libary',  name: 'libary', moduleId: PLATFORM.moduleName('./library'), nav: true, title: 'Library' }
    ]);

    this.router = router;
  }
}
