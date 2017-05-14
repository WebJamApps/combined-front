import {PLATFORM} from 'aurelia-pal';

export class DashboardRouter {
  heading = 'Dashboard Router';
  configureRouter(config, router) {
    config.map([
      { route: '', name: 'dashboard', moduleId: PLATFORM.moduleName('./dashboard'), nav: false, title: 'Dashboard', auth: true},
      { route: 'charity', name: 'charity', moduleId: PLATFORM.moduleName('./dashboard-child-routes/charity'), nav: true, title: 'Charity', auth: true},
      { route: 'volunteer', name: 'volunteer', moduleId: PLATFORM.moduleName('./dashboard-child-routes/volunteer'), nav: true, title: 'Volunteer', auth: true},
    //  { route: 'sc2rs', name: 'sc2rs', moduleId: PLATFORM.moduleName('./dashboard-child-routes/sc2rs'), nav: true, title: 'SC2RS', auth: true},
      { route: 'reader', name: 'reader', moduleId: PLATFORM.moduleName('./dashboard-child-routes/reader'), nav: true, title: 'Reader', auth: true},
      { route: 'librarian', name: 'librarian', moduleId: PLATFORM.moduleName('./dashboard-child-routes/librarian'), nav: true, title: 'Librarian', auth: true},
      { route: 'developer', name: 'developer', moduleId: PLATFORM.moduleName('./dashboard-child-routes/developer'), true: false, title: 'Developer', auth: true}
    ]);
    this.router = router;
  }
}
