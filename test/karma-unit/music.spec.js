import {Music} from '../../src/music';

describe('the Music module', () => {
  let music1;

  beforeEach(() => {
    music1 = new Music();
    //spyOn(music1, 'jump');
  });

  it('has jump links', (done) => {
    document.body.innerHTML = '<div id="joshbio"></div>';
    music1.jump('joshbio');
    //expect(music1.jump).toHaveBeenCalledWith('joshbio');
    done();
  });

  it('show slides when component is attached and there is no slide', (done) => {
    jasmine.clock().install();
    music1.attached();
    jasmine.clock().tick(5500);
    expect(document.getElementById('joshbio')).not.toBe(null);
    done();
    jasmine.clock().uninstall();
  });

  it('shows slides when component is attached', (done) => {
    jasmine.clock().install();
    document.body.innerHTML = '<div id="musicSlide1"><div></div></div><div id="slideshowMusic"><div class="mySlides"><img src="https://static.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg" /></div></div>';
    music1.attached();
    jasmine.clock().tick(5500);
    expect(document.getElementById('musicSlide1')).not.toBe(null);
    done();
    jasmine.clock().uninstall();
  });
});
