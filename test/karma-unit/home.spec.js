import { Home } from '../../src/home';

describe('the Home Module', () => {
  let home;
  beforeEach(() => {
    home = new Home();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof home.widescreenHomepage).toBe('boolean');
    done();
  });

  it('scrolls to top of page on page load', (done) => {
    document.body.innerHTML = '<div class="material-header"></div>';
    home.attached();
    expect(home.top).not.toBe(null);
    document.body.innerHTML = '';
    home.top = null;
    home.attached();
    expect(home.top).toBe(undefined);
    done();
  });
});
