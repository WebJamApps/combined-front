import {Music} from '../../src/music';

describe('the Music module', () => {
  let music1;

  beforeEach(() => {
    music1 = new Music();
  });

  it('has jump links', (done) => {
    document.body.innerHTML = '<div id=\'joshbio\'></div>';
    music1.jump('joshbio');
    //   //expect(music1.jump('joshbio')).toBe(defined);
    done();
  });

  // it('runs showSlides to display the slideshow', (done) => {
  //   document.body.innerHTML = '<div id="slideshow"><div></div><div>';
  //   music1.attached();
  //   music1.showSlides();
  //   done();
  // });
});
