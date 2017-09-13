// import {inject} from 'aurelia-framework';
// import {App} from './app';
// import {Router} from 'aurelia-router';
//import {activationStrategy} from 'aurelia-router';
// @inject(App, Router)
// @inject(App)
export class Music {
  // constructor(app){
  //   //this.auth = authService;
  //   this.app = app;
  //   this.slideIndex = 'howdy';
  //   //this.router = router;
  //   //this.appState = appState;
  // }
  // attached(){
  //   window.location.reload(false);
  // }

  // determineActivationStrategy() {
  //   return activationStrategy.replace; //replace the viewmodel with a new instance
  //   // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
  //   // or activationStrategy.noChange to explicitly use the default behavior
  // }

  jump(h){
    //console.log(document.getElementById(h));
    document.getElementById(h).scrollIntoView();
  }
  // slideIndex = 0;
  showSlides() {
    $('#slideshowMusic > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#slideshowMusic');
  }
  // showSlides(){
  //   if (this.slideIndex === undefined){
  //     this.slideIndex = 1;
  //   }
  //   console.log(this.slideIndex);
  //   let i;
  //   let slides = document.getElementsByClassName('mySlides');
  //   console.log(slides);
  //   for (i = 0; i < slides.length; i++) {
  //     if (slides[i] !== undefined){
  //       slides[i].style.display = 'none';
  //     }
  //   }
  //   this.slideIndex++;
  //   if (this.slideIndex > slides.length) {this.slideIndex = 1;}
  //   if (slides[this.slideIndex - 1] !== undefined){
  //     slides[this.slideIndex - 1].style.display = 'block';
  //   }
  //   console.log(this.slideIndex);
  // }

  attached() {
    //this.slideIndex = 0;
    //$('#slideshow > div:gt(0)').hide();
    setInterval(this.showSlides, 5500);
  }
}
