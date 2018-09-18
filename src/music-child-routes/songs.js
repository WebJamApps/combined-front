import data from '../../config.json';


export class Songs {
  oUrls = data.original.urls;
  _oUrls = data.original._urls;

  pUrls = data.pub.urls;
  _pUrls = data.pub._urls;

  mUrls = data.mission.urls;
  _mUrls = data.mission._urls;

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
