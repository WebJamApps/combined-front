import {OhafHome} from '../../src/ohaf-home';
//import {RouterStub} from './commons';

describe('the OhafHome Module', () => {
  let ohaf;
  beforeEach(() => {
    ohaf = new OhafHome();
  });

  it('gets widescreen', (done) => {
    ohaf.widescreen;
    done();
  });

  it('runs showslides with widescreen slideshow', (done) => {
    document.body.innerHTML = '<div id="slideshow1"><div></div><div>';
    ohaf.showSlides();
    done();
  });

  it('runs showSlides with mobile slideshow', (done) => {
    document.body.innerHTML = '<div id="slideshow"><div></div><div>';
    ohaf.attached();
    ohaf.showSlides();
    done();
  });
});
