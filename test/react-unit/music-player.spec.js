import { MusicPlayer } from '../../src/components/music-player';


describe('++MusicPlayer tests', () => {
  let mp;

  beforeEach(() => {
    document.body.innerHTML = '<div id="renderer" class="swipe-area"><section id="copier"></section><section id="copyMessage">'
      + '</section><button id="shuffle"></button><button id="play-pause"></button></div>';
    mp = new MusicPlayer();
    mp.element = document.getElementById('renderer');
    mp.data = [['DITR.mp3', 'Down In The River - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/alleluia-alleluia-give-thanks', 'Alleluia Alleluia Give Thanks - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/comeallyoupeople', 'Come All You People - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/ithelordofseaandskyhereiamlord', 'I The Lord Of Sea And Sky Here I Am Lord - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/one-bread-one-body', 'One Bread One Body - Josh Sherman'],
      ['https://soundcloud.com/joshandmariamusic/canticle-for-departure', 'Canticle For Departure - Josh Sherman']];
    mp.copy = mp.data;
    mp.urls = mp.data;
    mp._urls = mp.data;
    mp.url = mp.data[0];
  });

  it('should bind empty', () => {
    mp.urls = null;
    mp.bind();
  });

  it('should pause when on play', () => {
    mp.playing = true;
    mp.play();
  });

  it('shuffle the url and start play', () => {
    mp.shown = true;
    mp.shuffle();
    mp.share();
  });

  it('should simulate play end', () => {
    mp.playEnd();
    mp.playTrue();
  });

  it('should go on the preview', () => {
    mp.index = 0;
    mp.prev();
  });

  it('should go on the preview for the first song', () => {
    mp.index = 1;
    mp.prev();
  });

  it('should copy share', () => {
    mp.share();
    mp.play();
    mp.isShuffleOn = true;
    mp.shuffle();
  });

  it('should simulate the stop player', () => {
    mp.index = 7;
    mp.next();
  });

  it('should pause the player', () => {
    mp.pause();
  });

  it('should simulate click share holder', () => {
    mp.pressKey();
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
