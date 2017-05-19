// import {Router} from 'aurelia-router';
// import {inject} from 'aurelia-framework';
// @inject(Router)
export class OhafHome {
  // constructor(router) {
  //   this.router = router;
  // }

  get widescreen() {
    return document.documentElement.clientWidth > 980;
  }
  // attached() {
  //   document.title = this.router.currentInstruction.config.title;
  // }


}
