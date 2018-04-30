import { bindable } from 'aurelia-framework';
import { startSlides } from './commons/utils';

export class Library {
  @bindable
  columnWidth = '450px';

  slideshowImages = ['../static/imgs/library/books1.jpg',
    '../static/imgs/library/books2.jpg',
    '../static/imgs/library/books3.jpg'];

  constructor() {
    this.slideshow_data = {
      id: 'libslideshow1',
      slideshow_images: this.slideshowImages
    };
    this.slideshow_data2 = {
      id: 'libslideshow',
      slideshow_images: this.slideshowImages
    };
  }

  get widescreen() {
    return document.documentElement.clientWidth > 1000;
  }

  attached() {
    startSlides(['lSlide1', 'lSlide2'], 'you left the library page', ['libslideshow1', 'libslideshow']);
  }
}
