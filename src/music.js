// import {inject} from 'aurelia-framework';
// import {App} from './app';
// import {Router} from 'aurelia-router';
//
// @inject(App, Router)
export class Music {
  // constructor(app, router){
  //   this.app = app;
  //   this.router = router;
  // }
  activate(){
    this.slideIndex = 0;
    this.counter = 0;
  }

  jump(h){
    //console.log(document.getElementById(h));
    document.getElementById(h).scrollIntoView();
  }

  showSlides() {
    // const slides = document.getElementsByClassName('mySlides');
    // if (slides !== undefined){
    //   for (let i = 0; i < slides.length; i++) {
    //     //console.log(slides[i]);
    //     if (i === this.slideIndex) {
    //       slides[i].style.display = 'block';
    //     } else {
    //       slides[i].style.display = 'none';
    //     }
    //   }
    //   this.slideIndex++;
    //   if ((this.slideIndex + 1) > slides.length) {this.slideIndex = 0;}
    // }
    // this.counter++;
    // if (this.counter < 300){
    //   setTimeout(this.showSlides(), 3000); // Change image every 3 seconds
    // } else {
    //   this.activate();
    // }
  }
  attached(){
    this.showSlides();
  }
}
