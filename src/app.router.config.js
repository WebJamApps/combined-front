import {AuthorizeStep} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {UserAccess} from './classes/UserAccess.js';
import {PLATFORM} from 'aurelia-pal';

@inject(Router, AuthorizeStep)
export class AppRouterConfig{
  constructor(router){
    this.router = router;
  }
  configure(config1, router){
    let theAppRouterConfig = function(config){
      config.title = 'Web Jam LLC';
      config.options.pushState = true;
      config.options.root = '/';
      config.addPipelineStep('authorize', AuthorizeStep);//Is the actually Authorization to get into the /dashboard
      config.addPipelineStep('authorize', UserAccess);// provides access controls to prevent users from certain /dashboard child routes when not their userType (role)
      config.map([
        { route: 'dashboard', name: 'dashboard-router', moduleId: PLATFORM.moduleName('./dashboard-router'), nav: false, title: 'Dashboard', auth: true, settings: 'fa fa-tachometer'},
        { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./login'), nav: false, title: 'Login', settings: 'fa fa-sign-in'},
        { route: 'news', name: 'news', moduleId: PLATFORM.moduleName('./news'), nav: true, title: 'News', settings: 'fa fa-file-text-o' },
        { route: 'ohaf', name: 'ohaf', moduleId: PLATFORM.moduleName('./ohaf-home'), nav: true, title: 'OHAF', settings: 'fa fa-handshake-o' },
        // { route: 'sc2rs', name: 'sc2rs', moduleId: './sc2rs-home', nav: true, title: 'SC2RS', settings: 'fa fa-star-o' },
        // { route: 'library', name: 'library', moduleId: './library-home', nav: true, title: 'Library', settings: 'fa fa-book' },
        { route: 'music', name: 'music-router', moduleId: PLATFORM.moduleName('./music-router'), nav: true, title: 'Music', settings: 'fa fa-music' },
        // { route: 'textadventure', name: 'textadventure', moduleId: './textadventure-home', nav: true, title: 'Text Adventure', settings: 'fa fa-shield' },
        { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: true, title: 'Web Jam LLC', settings: 'fa fa-home' }
      ]);
      config.fallbackRoute('/');
    };
    
    this.router.configure(theAppRouterConfig);
  }
}
