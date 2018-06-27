export class Originals {
  attached() {
    if (document.location.search === '?oneplayer=true') {
      document.getElementById('wholeMusicSection').style.display = 'none';
    }
  }
}
