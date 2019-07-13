import { PLATFORM } from 'aurelia-pal';

export class OhafRouter {
  heading = 'Ohaf Router';

  configureRouter(config, router) {
    config.map([ // There is no way to refactor this that I can tell
      {
        route: '', name: 'ohaf', moduleId: PLATFORM.moduleName('./ohaf-home'), nav: false, title: 'OHAF', auth: false
      },
      {
        route: 'bookshelf', name: 'bookshelf', moduleId: PLATFORM.moduleName('./bookshelf'), nav: true, title: 'Bookshelf', auth: false
      },
      // {
      //   route: 'vol-ops/:id',
      //   name: 'vol-ops',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/vol-ops'),
      //   nav:
      //   false,
      //   title: 'Volunteer Opportunities',
      //   auth: true
      // },
      // {
      //   route: 'volunteer',
      //   name: 'volunteer',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/volunteer'),
      //   nav:
      //   true,
      //   title: 'Volunteer',
      //   auth: true
      // },
      // {
      //   route: 'reader',
      //   name: 'reader',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/reader'),
      //   nav:
      //   true,
      //   title: 'Reader',
      //   auth: true
      // },
      // {
      //   route: 'librarian',
      //   name: 'librarian',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/librarian'),
      //   nav:
      //   true,
      //   title: 'Librarian',
      //   auth: true
      // },
      // {
      //   route: 'developer',
      //   name: 'developer',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/developer'),
      //   nav:
      //   false,
      //   title: 'Developer',
      //   auth: true
      // },
      // {
      //   route: 'user-account',
      //   name: 'user-account',
      //   moduleId: PLATFORM.moduleName('./dashboard-child-routes/user-account'),
      //   nav:
      //   true,
      //   title: 'User Account',
      //   auth: true
      // }
    ]);
    this.router = router;
  }
}
