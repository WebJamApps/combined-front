export class Mission {
  constructor() {
    this.urls = [['DITR.mp3', 'Down In The River - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/alleluia-alleluia-give-thanks', 'Alleluia Alleluia Give Thanks - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/comeallyoupeople', 'Come All You People - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/ithelordofseaandskyhereiamlord', 'I The Lord Of Sea And Sky Here I Am Lord - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/one-bread-one-body', 'One Bread One Body - Josh Sherman'],
      ['https://soundcloud.com/joshandmariamusic/canticle-for-departure', 'Canticle For Departure - Josh Sherman']];
    this._urls = [['DITR.mp3', 'Down In The Rain - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/alleluia-alleluia-give-thanks', 'Alleluia Alleluia Give Thanks - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/comeallyoupeople', 'Come All You People - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/ithelordofseaandskyhereiamlord', 'I The Lord Of Sea And Sky Here I Am Lord - Web Jam Band'],
      ['https://soundcloud.com/joshandmariamusic/one-bread-one-body', 'One Bread One Body - Josh Sherman'],
      ['https://soundcloud.com/joshandmariamusic/canticle-for-departure', 'Canticle For Departure - Josh Sherman']];
  }

  attached() {
    // const head = document.getElementById('head');
    // head.innerHTML += '<meta property="og:title" content="Web Jam Band Original Songs"/>'
    // + '<meta property="og:description" content="Try out our new music player to hear many songs played in a continous loop"/>'
    // + '<meta property="og:image" content="https://web-jam.com/static/imgs/webjamlogo1.png"/>';
    if (document.location.search === '?oneplayer=true') {
      document.getElementById('wholeMusicSection').style.display = 'none';
      document.getElementsByClassName('content-block')[0].style.overflow = 'hidden';
      document.getElementsByClassName('content-block')[0].style.marginTop = '0';
      document.getElementsByClassName('page-content')[0].style.borderRight = '0';
      const h4 = document.getElementsByTagName('h4')[0];
      const header = document.getElementsByClassName('home-header')[0];
      const swipe = document.getElementsByClassName('swipe-area')[0];
      const footer = document.getElementById('wjfooter');
      const i = document.getElementById('mobilemenutoggle');
      const child = document.getElementsByClassName('home-sidebar')[0];
      child.parentNode.removeChild(child);
      i.parentNode.removeChild(i);
      h4.parentNode.removeChild(h4);
      swipe.parentNode.removeChild(swipe);
      footer.parentNode.removeChild(footer);
      header.parentNode.removeChild(header);
    }
  }
}
