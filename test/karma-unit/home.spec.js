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
  it('attaches to the dom with a reload in the url', (done) => {
    document.body.innerHTML = '<div class="home"><div class="topSection"></div><input class="loginemail"/></div>';
    window.history.pushState({}, 'home', '/?reload=true');
    home.attached();
    done();
  });
});
