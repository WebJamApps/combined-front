import {PLATFORM} from 'aurelia-pal';

export class DashboardRouter {
  heading = 'Dashboard Router';
  configureRouter(config, router) {
    config.map([
      { route: '', name: 'dashboard', moduleId: PLATFORM.moduleName('./dashboard'), nav: false, title: 'Dashboard', auth: true},
      { route: 'ohaf', name: 'ohaf', moduleId: PLATFORM.moduleName('./dashboard-child-routes/ohaf-router'), nav: true, title: 'OHAF', auth: true},
      { route: 'sc2rs', name: 'sc2rs', moduleId: PLATFORM.moduleName('./dashboard-child-routes/sc2rs-router'), nav: true, title: 'SC2RS', auth: true},
      { route: 'developer', name: 'developer', moduleId: PLATFORM.moduleName('./dashboard-child-routes/developer-router'), true: false, title: 'Developer', auth: true}
    ]);
    this.router = router;
  }
}
