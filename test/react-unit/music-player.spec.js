import { MusicPlayer } from '../../src/components/music-player';


describe('++MusicPlayer tests', () => {
  let mp;

  beforeEach(() => {
    mp = new MusicPlayer();
    document.body.innerHTML = '<div id="renderer"><section id="copier"></section><section id="copyMessage"></section></div>';
    mp.element = document.getElementById('renderer');
  });

  it('shuffle the url and start play', () => {
    mp.shown = true;
    mp.shuffle();
    mp.share();
  });

  it('should simulate play end', () => {
    mp.playEnd();
  });

  it('should copy share', () => {
    mp.share();
  });

  it('should simulate the stop player', () => {
    mp.index = 7;
    mp.next();
    mp.stop();
  });

  it('should pause the player', () => {
    mp.pause();
  });

  it('should copy the share url', (done) => {
    mp.navigator = {
      clipboard: {
        writeText(data) { return Promise.resolve(data); }
      }
    };
    mp.copyShare();
    setTimeout(() => {
      done();
    }, 1510);
  });
});
