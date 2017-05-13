//import {computedFrom} from 'aurelia-framework';
//import {Router, Bindable} from 'aurelia-router';
//import {inject} from 'aurelia-framework';

//@inject(Router)
export class Home {

  //constructor(router) {
    //this.router = router;
  //}


  get widescreen(){
    return document.documentElement.clientWidth > 1300;
  }
  // attached() {
  //     document.title = this.router.currentInstruction.config.title;
  // }
}
