import { MusicPlayer } from '../../src/components/music-player';


describe('++MusicPlayer tests', () => {
  let mp;

  beforeEach(() => {
    document.body.innerHTML = '<div id="renderer" class="swipe-area"><section id="copier"></section><section id="copyMessage">'
      + '</section><button id="shuffle"></button><button id="play-pause"></button></div>';
    mp = new MusicPlayer();
    mp.element = document.getElementById('renderer');
    mp.data = [
      {
        title: 'I Still Haven"t Found What I"m Looking For by U2 - Josh & Maria Sherman',
        category: 'pub',
        url: 'https://soundcloud.com/joshandmariamusic/still-havent-found-what-im-looking-for',
        id: '28ru9weis2309uoi4jrgbefieqr'
      },
      {
        title: 'Cups (when i"m gone) by A. P. Carter - Josh & Maria Sherman',
        category: 'pub',
        url: 'https://soundcloud.com/joshandmariamusic/cups-when-im-gone',
        id: '28ru9weis2309ur9r7ifuviuiu'
      },
      {
        title: 'I"m Yours by Jason Mraz - Josh & Maria Sherman',
        category: 'pub',
        url: 'https://soundcloud.com/joshandmariamusic/im-yours',
        id: '28ru9weis2309kjh34ig9gfui'
      }
    ];
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

  it('should render with a particular song with first true', (done) => {
    Object.defineProperty(window, 'location', {
      value: { search: 'oneplayer=true&id=28ru9weis2309ur9r7ifuviuiu' },
      writable: true
    });
    mp.first = true;
    mp.bind();
    done();
  });

  it('should test the htmls', () => {
    mp.reactPlayer();
    mp.buttons();
  });
});
