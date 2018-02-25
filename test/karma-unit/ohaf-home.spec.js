import {OhafHome} from '../../src/ohaf-home';
//import {RouterStub} from './commons';

describe('the OhafHome Module', () => {
  let ohaf;
  beforeEach(() => {
    ohaf = new OhafHome();
  });

  it('gets widescreen', (done) => {
    let truth = ohaf.widescreen;
    expect(typeof truth).toBe('boolean');
    done();
  });

  it('show slides when component is attached and there is no slide', (done) => {
    ohaf.attached();
    document.body.innerHTML = '';
    setTimeout(() => {
      expect(document.body.innerText).toBe('');
      done();
    }, 5500);
  }, 5550);

  it('shows slides when component is attached', (done) => {
    document.body.innerHTML = '<div id="musicSlide1"><div></div></div><div id="slideshow1"><div class="mySlides"><img src="https://static.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg" /></div></div> <div id="musicSlide2"><div></div></div><div id="slideshow"><div class="mySlides"><img src="https://static.pexels.com/photos/2422/sky-earth-galaxy-universe.jpg" /></div></div>';
    ohaf.attached();
    setTimeout(() => {
      expect(document.getElementById('musicSlide1')).not.toBe(null);
      done();
    }, 5500);
  }, 5550);
});
