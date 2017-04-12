//import {computedFrom} from 'aurelia-framework';
//import {Router, Bindable} from 'aurelia-router';
//import {inject} from 'aurelia-framework';

//@inject(Router)
export class Home {
  
  //constructor(router) {
    //this.router = router;
  //}
  
  
  get widescreen(){
    let iswidescreen = false;
    let currentscreenwidth = document.documentElement.clientWidth;
    /* istanbul ignore else */
    if (currentscreenwidth > 1275){
      iswidescreen = true;
      //this.columnWidth = '450px';
    } //else {
      //this.columnWidth = 'auto';
    //}
    return iswidescreen;
  }
  // attached() {
  //     document.title = this.router.currentInstruction.config.title;
  // }
}
