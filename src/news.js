//import {computedFrom} from 'aurelia-framework';


import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';

@inject(Router)
export class News {
  
  constructor(router) {
    this.router = router;
  }
  
  attached() {
    this.title = this.router.currentInstruction.config.title;
  }
}
