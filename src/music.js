// import {inject} from 'aurelia-framework';
// import {App} from './app';
// import {Router} from 'aurelia-router';
//
// @inject(App, Router)
export class Music {
  // constructor(app, router){
  //   this.app = app;
  //   this.router = router;
  // }
  jump(h){
    //console.log(document.getElementById(h));
    document.getElementById(h).scrollIntoView();
  }
}
