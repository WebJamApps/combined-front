import data from '../../config.json';


export class Songs {
  oUrls = data.songs.filter(song => song.category === 'original');
  _oUrls = Array.from(data.songs.filter(song => song.category === 'original'));

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
    this.originalElement.classList.remove('d-none');
    this.missionElement.classList.add('d-none');
    this.pubElement.classList.add('d-none');
  }

  missionClick() {
    this.originalElement.classList.add('d-none');
    this.missionElement.classList.remove('d-none');
    this.pubElement.classList.add('d-none');
  }

  pubClick() {
    this.originalElement.classList.add('d-none');
    this.missionElement.classList.add('d-none');
    this.pubElement.classList.remove('d-none');
  }

  attached() {
    this.originalElement = document.getElementById('original');
    this.missionElement = document.getElementById('mission');
    this.pubElement = document.getElementById('pub');
  }
}
