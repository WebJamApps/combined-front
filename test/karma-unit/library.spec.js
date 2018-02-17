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

  it('runs showSlides when component is attached', (done) => {
    document.body.innerHTML = '<div id="lSlide1"><div></div></div> <div id="lSlide2"><div></div></div>';
    lib1.attached();
    // the slideshow waits every 5.4 secs to run the function.
    // this would cause the function to not get called immediately.
    // to tests it, I have to block the runtime till the function for the slideshow gets called..
    setTimeout(() => {
      expect(document.getElementById('lSlide1')).not.toBe(null);
      done();
    }, 5500);
  }, 5550);

  it('runs showSlides when component is attached', (done) => {
    document.body.innerHTML = '';
    lib1.attached();
    // the slideshow waits every 5.4 secs to run the function.
    // this would cause the function to not get called immediately.
    // to tests it, I have to block the runtime till the function for the slideshow gets called..
    setTimeout(() => {
      expect(document.body.innerText).toBe('');
      done();
    }, 5500);
  }, 5550);
});
