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

  // it('attached', done => {
  //   ohaf.attached();
  //   done();
  // });
});
