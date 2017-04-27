import {OhafHome} from '../../src/ohaf-home';
import {RouterStub} from './commons';

describe('the Dashboard Module', () => {
  let ohaf;
  beforeEach(() => {
    ohaf = new OhafHome(new RouterStub());
  });

  it('get widescreen', done => {
    ohaf.widescreen;
    done();
  });

  it('attached', done => {
    ohaf.attached();
    done();
  });
});
