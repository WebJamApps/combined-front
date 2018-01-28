import {Library} from '../../src/library';

describe('the Library module', () => {
  let lib1;

  beforeEach(() => {
    lib1 = new Library();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof lib1.widescreen).toBe('boolean');
    done();
  });

  // it('runs showslides with widescreen slideshow', (done) => {
  //   document.body.innerHTML = '<div id="libslideshow1"><div></div><div>';
  //   lib1.showSlides();
  //   done();
  // });

  // it('runs showSlides with mobile slideshow', (done) => {
  //   document.body.innerHTML = '<div id="slideshow"><div></div><div>';
  //   lib1.attached();
  //   lib1.showSlides();
  //   done();
  // });
});
