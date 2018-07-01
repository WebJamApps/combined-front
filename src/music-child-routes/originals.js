export class Originals {
  attached() {
    if (document.location.search === '?oneplayer=true') {
      document.getElementById('wholeMusicSection').style.display = 'none';
      document.getElementById('wjfooter').style.display = 'none';
      document.getElementsByClassName('home-header')[0].style.display = 'none';
      document.getElementsByTagName('h4')[0].style.display = 'none';
      const child = document.getElementsByClassName('home-sidebar')[0];
      child.parentNode.removeChild(child);
    }
  }
}
