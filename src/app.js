//import {PLATFORM} from 'aurelia-pal';
import {inject, bindable} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AppRouterConfig} from './app.router.config';
import {FetchConfig} from 'aurelia-auth';
import {AuthService} from 'aurelia-auth';
import {HttpClient} from 'aurelia-fetch-client';
import {AppState} from './classes/AppState.js';
System.import('isomorphic-fetch');

@inject(Router, FetchConfig, AuthService, AppRouterConfig, HttpClient, AppState)
export class App {
  constructor(router, fetchConfig, auth, appRouterConfig, httpClient, appState) {
    this.router = router;
    this.appRouterConfig = appRouterConfig;
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
    this.auth.setToken('');
    this.authenticated = false;
    this.auth.logout('/');
  }

  // getTokens(){
  //   return this.auth.getTokenPayload();
  // }
  //

  activate() {
    this.appRouterConfig.configure();
    this.configHttpClient();
    if (this.auth.isAuthenticated()) {
      this.authenticated = true;
      this.appState.setAuth(true);
      this.appState.setRoles(['dashboard']);
    } else {
      this.authenticated = false;
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
        .withInterceptor(this.auth.tokenInterceptor);
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
    } else {
      result = {
        headerImagePath: '../static/imgs/webjamicon7.png',
        headerText: 'Web Jam LLC',
        headerClass: 'home-header',
        headerImageClass: 'home-header-image',
        sidebarClass: 'home-sidebar',
        menuToggleClass: 'home-menu-toggle'
      };
    }

    result.sidebarImagePath = '../static/imgs/webjamlogo1.png';

    return result;
  }
}
