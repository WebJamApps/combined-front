import {PLATFORM} from 'aurelia-pal';
import {inject, bindable} from 'aurelia-framework';
import {AuthorizeStep} from 'aurelia-auth';
import {UserAccess} from './classes/UserAccess.js';
//import {Router} from 'aurelia-router';
//import {AppRouterConfig} from './app.router.config';
import {FetchConfig} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {HttpClient} from 'aurelia-fetch-client';
import {AppState} from './classes/AppState.js';
System.import('isomorphic-fetch');

@inject(FetchConfig, AuthService, HttpClient, AppState)
export class App {
  constructor(fetchConfig, auth, httpClient, appState) {
    //this.router = router;
    //this.appRouterConfig = appRouterConfig;
    this.fetchConfig = fetchConfig;
    this.auth = auth;
    this.httpClient = httpClient;
    this.appState = appState;
  }
  
  email = '';
  password = '';
  authenticated = false;
  token = '';
  
  @bindable
  drawerWidth = '175px';
  
  @bindable
  fullmenu = true;
  
  configureRouter(config, router){
    config.title = 'Web Jam LLC';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);//Is the actually Authorization to get into the /dashboard
    config.addPipelineStep('authorize', UserAccess);// provides access controls to prevent users from certain /dashboard child routes when not their userType (role)
    config.map([
      { route: 'dashboard', name: 'dashboard-router', moduleId: PLATFORM.moduleName('./dashboard-router'), nav: false, title: 'Dashboard', auth: true, settings: 'fa fa-tachometer'},
      { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./login'), nav: false, title: 'Login', settings: 'fa fa-sign-in'},
      { route: 'news', name: 'news', moduleId: PLATFORM.moduleName('./news'), nav: true, title: 'News', settings: 'fa fa-file-text-o' },
      { route: 'ohaf', name: 'ohaf', moduleId: PLATFORM.moduleName('./ohaf-home'), nav: false, title: 'OHAF', settings: 'fa fa-handshake-o' },
      // { route: 'sc2rs', name: 'sc2rs', moduleId: './sc2rs-home', nav: true, title: 'SC2RS', settings: 'fa fa-star-o' },
      //      { route: 'librarian', name: 'librarian', moduleId: PLATFORM.moduleName('./librarian'), nav: true, title: 'Librarian', settings: 'fa fa-book' },
      { route: 'bookshelf', name: 'bookshelf', moduleId: PLATFORM.moduleName('./bookshelf'), nav: false, title: 'Bookshelf', settings: 'fa fa-book' },
      //  { route: 'reader', name: 'reader', moduleId: PLATFORM.moduleName('./reader'), nav: true, title: 'Reader', settings: 'fa fa-file-pdf-o' },
      { route: 'music', name: 'music-router', moduleId: PLATFORM.moduleName('./music-router'), nav: false, title: 'Music', settings: 'fa fa-music' },
      // { route: 'textadventure', name: 'textadventure', moduleId: './textadventure-home', nav: true, title: 'Text Adventure', settings: 'fa fa-shield' },
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: false, title: 'Web Jam LLC', settings: 'fa fa-home' }
    ]);
    config.fallbackRoute('/');
    this.router = router;
  }
  
  get widescreen() {
    let iswidescreen = false;
    let currentscreenwidth = document.documentElement.clientWidth;
    /* istanbul ignore else */
    if (currentscreenwidth > 766) {
      iswidescreen = true;
    }
    return iswidescreen;
  }
  
  toggleMenu() {
    console.debug(this.fullmenu);
    if (this.fullmenu) {
      this.fullmenu = false;
      this.drawerWidth = '50px';
    } else {
      this.fullmenu = true;
      this.drawerWidth = '175px';
    }
  }
  
  logout() {
    this.appState.setAuth(false);
    this.authenticated = false;
    this.auth.logout('/')
    .then(()=>{
      console.log('Promise fulfilled, logged out');
    });
  }
  
  // getTokens(){
  //   return this.auth.getTokenPayload();
  // }
  //
  
  async activate() {
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    await fetch;
    this.configHttpClient();
    
    if (this.auth.isAuthenticated()) {
      this.authenticated = true; //Logout element is reliant upon a local var;
      if (this.appState.getUser()._id === undefined){
        this.getUser();
      }
      // if (this.appState.getRoles().length === 0){
      //   this.appState.setRoles(['dashboard']);
      // }
      //}
      //this.authenticated = false;
    }
  }
  
  close() {
    if (!this.widescreen) {
      let drawer = document.getElementById('drawerPanel');
      drawer.closeDrawer();
    }
  }
  
  configHttpClient() {
    this.httpClient.configure(httpConfig => {
      httpConfig
      .withDefaults({
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json'
        }
      })
      .useStandardConfiguration()
      .withBaseUrl(this.backend)
      .withInterceptor(this.auth.tokenInterceptor); //Adds bearer token to every HTTP request.
    });
  }
  
  getUser(){
    let uid = this.auth.getTokenPayload().sub;
    this.httpClient.fetch('/user/' + uid)
    .then(response => response.json())
    .then(data => {
      let user = data;
      this.appState.setUser(user);
    });
  }
  
  get currentRoute() {
    if (this.router.currentInstruction) {
      return this.router.currentInstruction.config.name;
    }
  }
  
  get currentStyles() {
    let result = {};
    
    if (this.currentRoute === 'ohaf') {
      result = {
        headerImagePath: '../static/imgs/ohaf/charitylogo.png',
        headerText1: 'Our',
        headerText2: 'Hands And',
        headerText3: 'Feet',
        headerClass: 'ohaf-header',
        headerImageClass: 'ohaf-header-image',
        sidebarClass: 'ohaf-sidebar',
        menuToggleClass: 'ohaf-menu-toggle'
      };
      this.Menu = 'ohaf';
      //console.log(this.Menu);
    } else {
      //console.log(this.currentRoute);
      result = {
        headerImagePath: '../static/imgs/webjamicon7.png',
        headerText1: 'Web Jam LLC',
        headerClass: 'home-header',
        headerImageClass: 'home-header-image',
        sidebarClass: 'home-sidebar',
        menuToggleClass: 'home-menu-toggle'
      };
      if (this.currentRoute === 'music-router') {
        this.Menu = 'music';
        //console.log(this.Menu);
      } else {
        this.Menu = 'wj';
        //console.log(this.Menu);
      }
    }
    
    result.sidebarImagePath = '../static/imgs/webjamlogo1.png';
    
    return result;
  }
}
