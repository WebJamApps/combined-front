import {PLATFORM} from 'aurelia-pal';
export class Sc2rsRouter {
  heading = 'SC2RS Router';
  configureRouter(config, router) {
    config.map([
      { route: '', name: 'sc2rs', moduleId: PLATFORM.moduleName('./sc2rs'), nav: false, title: 'SC2RS', auth: true},
      { route: 'band', name: 'band', moduleId: PLATFORM.moduleName('./sc2rs-child-routes/band'), nav: true, title: 'Band', auth: true},
      { route: 'venue', name: 'venue', moduleId: PLATFORM.moduleName('./sc2rs-child-routes/venue'), nav: false, title: 'Venue', auth: true}
      //{ route: 'developer-router', name: 'developer-router', moduleId: './dashboard-child-routes/developer-router', nav: false, title: 'Developer Router', auth: true}
    ]);
    this.router = router;
  }
}
