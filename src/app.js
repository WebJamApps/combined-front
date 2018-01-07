System.import('isomorphic-fetch');
System.import('whatwg-fetch');
import {PLATFORM} from 'aurelia-pal';
import {inject, bindable} from 'aurelia-framework';
import {AuthorizeStep} from 'aurelia-auth';
import {UserAccess} from './classes/UserAccess.js';
import {AuthService} from 'aurelia-auth';
import {json, HttpClient} from 'aurelia-fetch-client';
import {AppState} from './classes/AppState.js';
@inject(AuthService, HttpClient)
export class App {
  constructor(auth, httpClient) {
    this.auth = auth;
    this.httpClient = httpClient;
    this.dashboardTitle = 'Dashboard';
    this.role = '';
  }

  email = '';
  password = '';
  authenticated = false;
  token = '';
  expanded = false;
  @bindable
  drawerWidth = '175px';

  @bindable
  fullmenu = true;

  async activate() {
    this.configHttpClient();
    this.appState = new AppState(this.httpClient);
    this.userAccess = new UserAccess(this.appState);
    this.states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    this.states.sort();

    await this.checkUser();
  }

  async checkUser(){
    if (this.auth.isAuthenticated()) {
      this.authenticated = true; //Logout element is reliant upon a local var;
      let uid = this.auth.getTokenPayload().sub;
      this.user = await this.appState.getUser(uid);
      if (this.user !== undefined){
        this.role = this.user.userType;
      }
    }
  }

  configHttpClient() {
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    this.httpClient.configure((httpConfig) => {
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

  configureRouter(config, router){
    config.title = 'Web Jam LLC';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);//Is the actually Authorization to get into the /dashboard
    config.addPipelineStep('authorize', this.userAccess);// provides access controls to prevent users from certain /dashboard child routes when not their userType (role)
    config.map([
      { route: 'dashboard', name: 'dashboard-router', moduleId: PLATFORM.moduleName('./dashboard-router'), nav: false, title: '', auth: true, settings: 'fa fa-tachometer'},
      { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('./login'), nav: false, title: 'Login', settings: 'fa fa-sign-in'},
      //{ route: 'news', name: 'news', moduleId: PLATFORM.moduleName('./news'), nav: true, title: 'News', settings: 'fa fa-file-text-o' },
      { route: 'ohaf', name: 'ohaf', moduleId: PLATFORM.moduleName('./ohaf-home'), nav: false, title: 'OHAF', settings: 'fa fa-handshake-o' },
      { route: 'sc2rs', name: 'sc2rs', moduleId: PLATFORM.moduleName('./sc2rs'), nav: false, title: 'SC2RS', settings: 'fa fa-microphone' },
      // { route: 'sc2rs', name: 'sc2rs', moduleId: './sc2rs-home', nav: true, title: 'SC2RS', settings: 'fa fa-star-o' },
      //      { route: 'librarian', name: 'librarian', moduleId: PLATFORM.moduleName('./librarian'), nav: true, title: 'Librarian', settings: 'fa fa-book' },
      { route: 'library', name: 'library', moduleId: PLATFORM.moduleName('./library'), nav: false, title: 'Library', settings: 'fa fa-book' },
      { route: 'bookshelf', name: 'bookshelf', moduleId: PLATFORM.moduleName('./bookshelf'), nav: false, title: 'Bookshelf', settings: 'fa fa-book' },
      //  { route: 'reader', name: 'reader', moduleId: PLATFORM.moduleName('./reader'), nav: true, title: 'Reader', settings: 'fa fa-file-pdf-o' },
      { route: 'music', name: 'music-router', moduleId: PLATFORM.moduleName('./music-router'), nav: false, title: '', settings: 'fa fa-music'},
      // { route: 'textadventure', name: 'textadventure', moduleId: './textadventure-home', nav: true, title: 'Text Adventure', settings: 'fa fa-shield' },
      { route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: false, title: '', settings: 'fa fa-home' }
    ]);
    config.fallbackRoute('/');
    this.router = router;
  }

  get widescreen() {
    return document.documentElement.clientWidth > 766;
  }

  toggleMenu() {
    //console.debug(this.fullmenu);
    if (this.fullmenu) {
      this.fullmenu = false;
      this.drawerWidth = '50px';
    } else {
      this.fullmenu = true;
      this.drawerWidth = '175px';
    }
  }

  ohafLogin(){
    //this.close();
    console.log('ohaf login!');
    this.menu = 'ohaf';
    this.appState.isOhafLogin = true;
    this.router.navigate('/login');
  }

  wjLogin(){
    //this.close();
    console.log('wj login!');
    this.menu = 'wj';
    this.appState.isOhafLogin = false;
    this.router.navigate('/login');
  }

  logout() {
    this.appState.setUser({});
    this.authenticated = false;
    if (this.role !== 'Charity' && this.role !== 'Volunteer'){
      this.auth.logout('/')
      .then(() => {
        console.log('Promise fulfilled, logged out');
      });
    } else {
      this.auth.logout('/ohaf')
      .then(() => {
        console.log('Promise fulfilled, logged out');
      });
    }
    this.role =  '';
    this.appState.isOhafLogin = false;
  }

  close() {
    let drawer = document.getElementById('drawerPanel');
    drawer.closeDrawer();
  }

  get currentRoute() {
    if (this.router.currentInstruction) {
      return this.router.currentInstruction.config.name;
    }
  }

  get currentRouteFrag() {
    /* istanbul ignore else */
    if (this.router.currentInstruction) {
      return this.router.currentInstruction.fragment;
    }
  }

  checkNavMenu(){
    this.Menu = 'wj';
    if (this.currentRoute === 'ohaf' || this.currentRouteFrag === '/ohaf') {
      this.Menu = 'ohaf';
    } else if (this.currentRoute === 'music-router') {
      this.Menu = 'music';
    } else if (this.currentRoute === 'library') {
      this.Menu = 'library';
    } else if (this.currentRoute === 'login') {
      if (this.appState.isOhafLogin){
        this.Menu = 'ohaf';
      } else {
        this.Menu = 'wj';
      }
    } else if (this.currentRouteFrag === '/dashboard'){
      this.Menu = 'dashboard';
    } else if (this.currentRouteFrag === '/bookshelf'){
      this.Menu = 'bookshelf';
    } else if (this.currentRouteFrag === '/dashboard/developer'){
      this.Menu = 'developer';
    } else if (this.currentRouteFrag === '/dashboard/reader'){
      this.Menu = 'reader';
    } else if (this.currentRouteFrag === '/dashboard/librarian'){
      this.Menu = 'librarian';
    } else if (this.currentRouteFrag === '/dashboard/charity'){
      this.Menu = 'charity';
    } else if (this.currentRouteFrag === '/dashboard/volunteer'){
      this.Menu = 'volunteer';
    } else if (this.currentRouteFrag === '/dashboard/user-account'){
      this.Menu = 'user-account';
    } else if (this.currentRouteFrag !== undefined){
      if (this.currentRouteFrag.indexOf('vol-ops/') !== -1){
        this.Menu = 'charity';
      } else {
        this.Menu = 'wj';
      }
    } else {
      this.Menu = 'wj';
    }
  }

  setFooter(style){
    let footer = document.getElementById('wjfooter');
    let color = '';
    if (footer !== null){
      footer.style.backgroundColor = '#2a222a';
      if (style === 'ohaf'){
        footer.style.backgroundColor = '#565656';
        color = '#c09580';
      }
      footer.innerHTML = '<div style="text-align: center"><span>&nbsp;&nbsp;</span>' +
      '<a target="_blank" style="color:' + color + '" onMouseOver="this.style.color=\'white\'" href="https://github.com/WebJamApps"><i class="fa fa-github fa-2x" aria-hidden="true"></i></a>' +
      '<span>&nbsp;&nbsp;</span><a target="_blank" style="color:' + color + '" onMouseOver="this.style.color=\'white\'" href="https://www.linkedin.com/company-beta/16257103"><i class="fa fa-linkedin fa-2x" aria-hidden="true"></i></a>' +
      '<span>&nbsp;&nbsp;</span><a target="_blank" style="color:' + color + '" onMouseOver="this.style.color=\'white\'" href="https://www.facebook.com/WebJamLLC/"><i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i></a>' +
      '<span>&nbsp;&nbsp;</span><a target="_blank" style="color:' + color + '" onMouseOver="this.style.color=\'white\'" href="https://plus.google.com/u/1/109586499331294076292"><i class="fa fa-google-plus-square fa-2x" aria-hidden="true"></i></a>' +
      '<span>&nbsp;&nbsp;</span><a target="_blank" style="color:' + color + '" onMouseOver="this.style.color=\'white\'" href="https://twitter.com/WebJamLLC"><i class="fa fa-twitter fa-2x" aria-hidden="true"></i></a><br>' +
      '<span style="color:white; font-size: 9pt; padding-left:18px;">Powered by ' +
      '<a class="wjllc" target="_blank" onMouseOver="this.style.color=\'gray\'" href="https://www.web-jam.com">Web Jam LLC</a></span></div>';
    }
  }

  get currentStyles() {
    let result = {};
    let style = 'wj';
    //let footer = document.getElementById('wjfooter');
    let mobilemenutoggle = document.getElementById('mobilemenutoggle');
    //let color = '';
    this.checkNavMenu();
    if (this.Menu === 'charity' || this.Menu === 'ohaf' || this.Menu === 'volunteer' || this.role === 'Charity' || this.role === 'Volunteer'){
      style = 'ohaf';
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
      result.sidebarImagePath = '../static/imgs/ohaf/butterfly.png';
      if (mobilemenutoggle !== null){
        mobilemenutoggle.style.backgroundColor = '#565656';
      }
    } else {
      result = {
        headerImagePath: '../static/imgs/webjamicon7.png',
        headerText1: 'Web Jam LLC',
        headerClass: 'home-header',
        headerImageClass: 'home-header-image',
        sidebarClass: 'home-sidebar',
        menuToggleClass: 'home-menu-toggle'
      };
      result.sidebarImagePath = '../static/imgs/webjamlogo1.png';
      // if (footer !== null){
      //
      // }
      if (mobilemenutoggle !== null){
        mobilemenutoggle.style.backgroundColor = '#2a222a';
      }
    }
    this.setFooter(style);
    return result;
  }

  showCheckboxes(id){
    //let checkboxes = null;
    //if (id !== null){
    let checkboxes = document.getElementById(id);
    // }    else {
    //   checkboxes = document.getElementById('checkboxes-iron');
    // }
    //console.log('what is this expanded?');
    //console.log(this.expanded);
    if (checkboxes.style.display === 'block') {
      checkboxes.style.display = 'none';
      //this.expanded = true;
    } else {
      checkboxes.style.display = 'block';
      //this.expanded = false;
    }
  }

  buildPTag(object, objectSelector, objectSelectorOther, objectStoreResult){
    for (let l = 0; l < object.length; l++){
      let typeHtml = '';
      for (let i = 0; i < object[l][objectSelector].length; i++) {
        if (object[l][objectSelector][i] !== ''){
          if (object[l][objectSelector][i] !== 'other'){
            typeHtml = typeHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + object[l][objectSelector][i] + '</p>';
          } else {
            typeHtml = typeHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + object[l][objectSelectorOther] + '</p>';
          }
        }
      }
      if (typeHtml === ''){
        typeHtml = '<p style="font-size:10pt">not specified</p>';
      }
      object[l][objectStoreResult] = typeHtml;
    }
  }

  selectPickedChange(selectorObj, thisObj, mainSelectedList, selectorOtherVariable, otherVariable, selectorUseThis = false, userVariable = undefined){
    if (userVariable !== undefined) {
      selectorObj[userVariable] = thisObj[mainSelectedList];
    }
    let exists = false;
    //console.log('Selector this: ');
    //console.log(selector_use_this);
    if (selectorUseThis === true){
      if (thisObj[mainSelectedList].includes('other')) {
        exists = true;
      }
    } else {
      if (selectorObj[mainSelectedList].includes('other')){
        exists = true;
      }
    }
    if (exists === true){
      thisObj[otherVariable] = true;
    } else {
      thisObj[otherVariable] = false;
      selectorObj[selectorOtherVariable] = '';
    }
  }

  async updateById(route, id, dataObj, afterFunction){
    await fetch;
    return this.httpClient.fetch(route + id, {
      method: 'put',
      body: json(dataObj)
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (afterFunction !== null){
        afterFunction();
      } else {
        //this.afterUpdateUser();
      }
    }).catch((error) => {
      console.log(error);
    });

  // afterUpdateUser(){
  //   this.appState.setUser(this.user);
  //   this.appState.checkUserRole();
  //   this.router.navigate('dashboard');
  // }
  }
}
