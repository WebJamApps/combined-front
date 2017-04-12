
import {AppRouterConfig} from '../../src/app.router.config';
//import {AuthorizeStep} from 'aurelia-auth';

import {RouterStub} from './commons';

describe('the app.router.config module', () => {
  var sut;
  var mockedRouter;
  
  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new AppRouterConfig(mockedRouter);
    sut.configure();
  });
  
  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });
  
  it('configures the router title', () => {
    expect(sut.router.title).toEqual('Web Jam LLC');
  });
  
  it('configures the router to use pushState', () => {
    expect(sut.router.options.pushState).toBe(true);
  });
  
  it('configures the router\'s root to be /', () => {
    expect(sut.router.options.root).toBe('/');
  });
  
  // it('should have an Home route', () => {
  //   expect(sut.router.routes).toContain({ route: ['', 'home'], name: 'home',  moduleId: './home', nav: true, title: 'Home' });
  // });
  
  // it('should have a Book Shelf route', () => {
  //   expect(sut.router.routes).toContain({ route: 'bookshelf', name: 'bookshelf', moduleId: './bookshelf', nav: true, title: 'Book Shelf', settings: 'fa fa-book'});
  // });
  
  // it('should have a Create Books route', () => {
  //   expect(sut.router.routes).toContain({ route: 'createbooks', name: 'createbooks', moduleId: './createBooks', nav: false, title: 'Create Books', settings: 'fa fa-plus'});
  // });
  
  // it('should have a login route', () => {
  //   expect(sut.router.routes).toContain({ route: 'login', name: 'login', moduleId: './login', nav: false, title: 'Login', settings: 'fa fa-sign-in'});
  // });
  //
  // it('should have a dashboard route', () => {
  //   expect(sut.router.routes).toContain({ route: 'dashboard', name: 'dashboard-router', moduleId: './dashboard-router', nav: false, title: 'Dashboard', auth: true, settings: 'fa fa-tachometer' });
  // });
  //
  // it('should have a release notes route', () => {
  //   expect(sut.router.routes).toContain({ route: 'releasenotes', name: 'releasenotes', moduleId: './releasenotes', nav: true, title: 'Release Notes', settings: 'fa fa-file-text-o' });
  // });
});
