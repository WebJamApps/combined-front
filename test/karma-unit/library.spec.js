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

  it('runs showSlides when component is attached', (done) => {
    jasmine.clock().install();
    document.body.innerHTML = '<div id="lSlide1"><div></div></div><div id="libslideshow1"><div class="mySlides"><img src="https://static.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg" /></div></div> <div id="lSlide2"><div></div></div><div id="libslideshow"><div class="mySlides"><img src="https://static.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg" /></div></div>';
    lib1.attached();
    jasmine.clock().tick(5500);
    expect(document.getElementById('libslideshow1')).not.toBe(null);
    done();
    jasmine.clock().uninstall();
  });
});
