const showSlides = require('./commons/showSlides');

export class Music {
  constructor() {
    this.slideshow_data = {
      id: 'slideshowMusic',
      slideshow_images: ['../../static/imgs/martinsville2017.png', '../../static/imgs/prom2015.png',
        '../../static/imgs/ourWedding.png', '../../static/imgs/hiddenValleyTalentShow.png']
    };
  }

  jump(h) {
    document.getElementById(h).scrollIntoView();
  }

  attached() {
    const musicTimer = setInterval(() => {
      const ms1 = document.getElementById('musicSlide1');
      if (ms1 !== null && ms1 !== undefined) {
        ms1.style.display = 'none';
      } else { return clearInterval(musicTimer); }
      return showSlides.showSlides(['slideshowMusic']);
    }, 5400);
  }
}
