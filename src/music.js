const showSlides = require('./commons/showSlides');

export class Music {
  constructor() {
    this.showSlides = showSlides;
    this.slideshow_data = {
      id: 'slideshowMusic',
      slideshow_images: ['../../static/imgs/martinsville2017.png', '../../static/imgs/fifthWedAnniversary.png', '../../static/imgs/prom2015.png',
        '../../static/imgs/hiddenValleyTalentShow.png', '../../static/imgs/ourWedding.png']
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
      return this.showSlides.showSlides(['slideshowMusic'], document);
    }, 5400);
  }
}
