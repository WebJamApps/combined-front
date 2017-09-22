import {bindable} from 'aurelia-framework';

export class Library {

  @bindable
  columnWidth = '450px';

  get widescreen(){
    return document.documentElement.clientWidth > 1000;
  }

  showSlides() {
    let slides;
    slides = document.getElementById('libslideshow1');
    if (slides !== null){
      $('#libslideshow1 > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#libslideshow1');
    } else {
      $('#libslideshow > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#libslideshow');
    }
  }

  attached() {
    setInterval(this.showSlides, 4000);
  }

}
