import {Home} from '../../src/home';

describe('the Home Module', () => {
  let home;
  beforeEach(() => {
    home = new Home();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof home.widescreen).toBe('boolean');
    done();
  });
});
