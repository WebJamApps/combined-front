import data from '../../config.json';


export class Songs {
  oUrls = data.original.urls;
  _oUrls = data.original._urls;

  pUrls = data.pub.urls;
  _pUrls = data.pub._urls;

  mUrls = data.mission.urls;
  _mUrls = data.mission._urls;
}
