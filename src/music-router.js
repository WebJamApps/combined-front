export class MusicRouter {
  heading = 'Music Router';

  configureRouter(config, router) {
    config.map([
      {
        route: 'originals', name: 'originals', moduleId: PLATFORM.moduleName('./music-child-routes/originals'), nav: true, title: 'Original Songs'
      },
      {
        route: 'mission', name: 'mission', moduleId: PLATFORM.moduleName('./music-child-routes/mission'), nav: true, title: 'Mission Music'
      },
      {
        route: 'pub', name: 'pub', moduleId: PLATFORM.moduleName('./music-child-routes/pub'), nav: true, title: 'Pub Songs'
      },
    ]);
    this.router = router;
  }
}
