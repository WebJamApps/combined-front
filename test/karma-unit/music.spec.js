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

  it('show slides when component is attached and there is no slide', (done) => {
    music1.attached();
    setTimeout(() => {
      done();
    }, 5500);
  }, 5550);

  it('shows slides when component is attached', (done) => {
    document.body.innerHTML = '<div id="musicSlide1"><div></div></div>';
    music1.attached();
    setTimeout(() => {
      done();
    }, 5500);
  }, 5550);
});
