import {bindable} from 'aurelia-framework';
import {showSlides} from './commons/utils.js';
export class Library {

  @bindable
  columnWidth = '450px';

  slideshowImages = ['../static/imgs/library/books1.jpg',
    '../static/imgs/library/books2.jpg',
    '../static/imgs/library/books3.jpg'];

  constructor(){
    this.slideshow_data = {
      id: 'libslideshow1',
      slideshow_images: this.slideshowImages
    };
    this.slideshow_data2 = {
      id: 'libslideshow',
      slideshow_images: this.slideshowImages
    };
  }

  get widescreen(){
    return document.documentElement.clientWidth > 1000;
  }

  attached() {
    let lTimer = setInterval(function(){
      let ms1 = document.getElementById('lSlide1');
      let ms2 = document.getElementById('lSlide2');
      if (ms1 !== null && ms1 !== undefined){
        ms1.style.display = 'none';
      }
      if (ms2 !== null && ms1 !== undefined){
        ms2.style.display = 'none';
      }
      if ((ms1 === undefined || ms1 === null) && (ms2 === undefined || ms2 === null)) {
        console.log('you left the library page');
        return clearInterval(lTimer);
      }
      showSlides(['libslideshow1', 'libslideshow']);
    }, 5400);
  }

}
