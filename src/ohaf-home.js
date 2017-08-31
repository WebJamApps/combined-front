// import {Router} from 'aurelia-router';
// import {inject} from 'aurelia-framework';
// @inject(Router)
export class OhafHome {
  // constructor(router) {
  //   this.router = router;
  // }

  get widescreen() {
    return document.documentElement.clientWidth > 1100;
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
    //$('#slideshow > div:gt(0)').hide();
    //$('#slideshow1 > div:gt(0)').hide();
    setInterval(this.showSlides, 4000);
  }

}
