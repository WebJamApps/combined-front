// import {Router} from 'aurelia-router';
// import {inject} from 'aurelia-framework';
import { startSlides } from './commons/utils.js';
// @inject(Router)
export class OhafHome {
  // constructor(router) {
  //   this.router = router;
  // }
  slideshowImages = [
    '../static/imgs/ohaf/slideshow2.png',
    '../static/imgs/ohaf/slideshow3.png',
    '../static/imgs/ohaf/slideshow4.png',
    '../static/imgs/ohaf/slideshow5.png',
    '../static/imgs/ohaf/slideshow6.png',
    '../static/imgs/ohaf/slideshow7.png',
    '../static/imgs/ohaf/slideshow8.png',
    '../static/imgs/ohaf/slideshow9.png',
    '../static/imgs/ohaf/slideshow10.png',
    '../static/imgs/ohaf/slideshow11.png',
    '../static/imgs/ohaf/slideshow12.png', '../static/imgs/ohaf/slideshow1.png'];

  constructor() {
    this.slideshow_data = {
      id: 'slideshow1',
      slideshow_images: this.slideshowImages
    };
    this.slideshow_data2 = {
      id: 'slideshow',
      slideshow_images: this.slideshowImages
    };
  }

  get widescreen() {
    return document.documentElement.clientWidth > 1100;
  }

  attached() {
    startSlides(['musicSlide1', 'musicSlide2'], 'you left the ohaf page', ['slideshow1', 'slideshow']);
  }
}
