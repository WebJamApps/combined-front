import data from '../../config.json';


export class Mission {
  urls = data.songs.filter(song => song.category === 'mission');

  _urls = Array.from(data.songs.filter(song => song.category === 'mission'));
}
