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
});
