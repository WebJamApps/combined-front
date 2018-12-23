import { Library } from '../../src/library';

describe('the Library module', () => {
  let lib1;
  beforeEach(() => {
    lib1 = new Library();
  });
  it('checks that widescreen is boolean', (done) => {
    expect(typeof lib1.widescreen).toBe('boolean');
    done();
  });
});
