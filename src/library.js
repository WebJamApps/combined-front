import { bindable } from 'aurelia-framework';
import { startSlides } from './commons/utils';

export class Library {
  @bindable
  columnWidth = '450px';

  slideshowImages = [
    '../static/imgs/library/books1.jpg',
    '../static/imgs/library/books2.jpg',
    '../static/imgs/library/books3.jpg'
  ];

  get widescreen() {
    return document.documentElement.clientWidth > 1000;
  }
}
