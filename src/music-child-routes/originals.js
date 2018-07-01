export class Originals {
  attached() {
    if (document.location.search === '?oneplayer=true') {
      document.getElementById('wholeMusicSection').style.display = 'none';
      document.getElementsByClassName('content-block')[0].style.overflow = 'hidden';
      document.getElementsByClassName('page-content')[0].style.borderRight = '0';
      document.getElementsByTagName('h4')[0].style.display = 'none';

      const header = document.getElementsByClassName('home-header')[0];
      const footer = document.getElementById('wjfooter');
      const i = document.getElementById('mobilemenutoggle');
      const child = document.getElementsByClassName('home-sidebar')[0];
      child.parentNode.removeChild(child);
      i.parentNode.removeChild(i);
      footer.parentNode.removeChild(footer);
      header.parentNode.removeChild(header);
    }
  }
}
