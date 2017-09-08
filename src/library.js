import {bindable} from 'aurelia-framework';

export class Library {

  @bindable
  columnWidth = '450px';

  get widescreen(){
    return document.documentElement.clientWidth > 1000;
  }

  showSlides() {
    let slides;
    slides = document.getElementById('slideshow1');
    if (slides !== null){
      $('#slideshow1 > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#slideshow1');
    } else {
      $('#slideshow > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#slideshow');
    }
  }

  attached() {
    setInterval(this.showSlides, 4000);
  }

}
