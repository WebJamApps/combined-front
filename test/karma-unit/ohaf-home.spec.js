import { OhafHome } from '../../src/ohaf-home';
// import {RouterStub} from './commons';

describe('the OhafHome Module', () => {
  let ohaf;
  beforeEach(() => {
    ohaf = new OhafHome();
  });
  it('gets widescreen', (done) => {
    const truth = ohaf.widescreen;
    expect(typeof truth).toBe('boolean');
    done();
  });
  it('attaches to the dom', (done) => {
    let isAttached = false;
    ohaf.startSlides = function startSlides() { return true; };
    isAttached = ohaf.attached();
    expect(isAttached).toBe(true);
    done();
  });
});
