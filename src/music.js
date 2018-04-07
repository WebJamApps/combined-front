
import {showSlides} from './commons/utils.js';

export class Music {

  constructor(){
    this.slideshow_data = {
      id: 'slideshowMusic',
      slideshow_images: ['../../static/imgs/prom2015.png', '../../static/imgs/ourWedding.png', '../../static/imgs/hiddenValleyTalentShow.png']
    };
  }

  jump(h){
    //console.log(document.getElementById(h));
    document.getElementById(h).scrollIntoView();
  }

  attached() {
    //this.slideIndex = 0;
    //$('#slideshow > div:gt(0)').hide();
    let musicTimer = setInterval(function(){
      let ms1 = document.getElementById('musicSlide1');
      if (ms1 !== null && ms1 !== undefined){
        ms1.style.display = 'none';
      } else {
        console.log('you left the music page');
        return clearInterval(musicTimer);
      }
      showSlides(['slideshowMusic']);
    }, 5400);
  }
}
