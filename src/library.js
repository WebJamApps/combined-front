import {bindable} from 'aurelia-framework';
import {showSlides} from './commons/utils.js';
export class Library {

  @bindable
  columnWidth = '450px';

  slideshow_images = ['../static/imgs/library/books1.jpg',
                      '../static/imgs/library/books2.jpg',
                      '../static/imgs/library/books3.jpg'];

  constructor(){
    this.slideshow_data = {
      id : "libslideshow1",
      slideshow_images: this.slideshow_images
    };
    this.slideshow_data2 = {
      id : "libslideshow",
      slideshow_images: this.slideshow_images
    };
  }

  get widescreen(){
    return document.documentElement.clientWidth > 1000;
  }

  attached() {
    setInterval(function(){
      showSlides(["libslideshow1", "libslideshow"]);
    }, 5400);
  }

}
