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

  it('show slides when component is attached and there is no slide', (done) => {
    ohaf.attached();
    document.body.innerHTML = '';
    setTimeout(() => {
      done();
    }, 5500);
  }, 5550);

  it('shows slides when component is attached', (done) => {
    document.body.innerHTML = '<div id="musicSlide1"><div></div></div><div id="musicSlide2"><div></div></div>';
    ohaf.attached();
    setTimeout(() => {
      done();
    }, 5500);
  }, 5550);
});
