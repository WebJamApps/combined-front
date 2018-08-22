export class Originals {
  constructor() {
    this.urls = [['DG.mp3', 'Don\'t Go - Web Jam Band'],
      ['MRM.mp3', 'Misty Rainy Morning - Web Jam Band'],
      ['AT.mp3', 'Alone Time - Web Jam Band'],
      ['TTGA.mp3', 'Try to Get Along - Web Jam Band'],
      [`https://www.youtube.com/embed/ach2ubW21h4?origin=http://${document.location.host}`, 'Boogie Board Rash - Josh Sherman'],
      [`https://www.youtube.com/embed/mCvUBjuzfo8?origin=http://${document.location.host}`, 'Hey Red - Josh Sherman'],
      ['https://soundcloud.com/joshandmariamusic/good-enough', 'Good Enough - Josh & Maria Sherman']];

    this._urls = [['DG.mp3', 'Don\'t Go - Web Jam Band'],
      ['MRM.mp3', 'Misty Rainy Morning - Web Jam Band'],
      ['AT.mp3', 'Alone Time - Web Jam Band'],
      ['TTGA.mp3', 'Try to Get Along - Web Jam Band'],
      [`https://www.youtube.com/embed/ach2ubW21h4?origin=http://${document.location.host}`, 'Boogie Board Rash - Josh Sherman'],
      [`https://www.youtube.com/embed/mCvUBjuzfo8?origin=http://${document.location.host}`, 'Hey Red - Josh Sherman'],
      ['https://soundcloud.com/joshandmariamusic/good-enough', 'Good Enough - Josh & Maria Sherman']];
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
