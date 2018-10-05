import data from '../../config.json';


export class Songs {
  urls = data.songs;

  _urls = Array.from(data.songs);

  oUrls = data.songs.filter(song => song.category === 'originals');

  _oUrls = Array.from(data.songs.filter(song => song.category === 'originals'));

  pUrls = data.songs.filter(song => song.category === 'pub');

  _pUrls = Array.from(data.songs.filter(song => song.category === 'pub'));

  mUrls = data.songs.filter(song => song.category === 'mission');

  _mUrls = Array.from(data.songs.filter(song => song.category === 'mission'));

  constructor() {
    this.originalElement = null;
    this.missionElement = null;
    this.pubElement = null;
  }

  originalClick() {
    // this.originalElement.classList.remove('d-none');
    // this.missionElement.classList.add('d-none');
    // this.pubElement.classList.add('d-none');
    this.urls = this.oUrls;
    this._urls = this._oUrls;
  }

  missionClick() {
    // this.originalElement.classList.add('d-none');
    // this.missionElement.classList.remove('d-none');
    // this.pubElement.classList.add('d-none');
    this.urls = this.mUrls;
    this._urls = this._mUrls;
  }

  pubClick() {
    // this.originalElement.classList.add('d-none');
    // this.missionElement.classList.add('d-none');
    // this.pubElement.classList.remove('d-none');
    this.urls = this.pUrls;
    this._urls = this._pUrls;
  }

  attached() {
    // this.originalElement = document.getElementById('original');
    // this.missionElement = document.getElementById('mission');
    // this.pubElement = document.getElementById('pub');
  }
}
