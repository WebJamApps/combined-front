import data from '../../config.json';


export class Pub {
  urls = data.songs.filter(song => song.category === 'pub');
  _urls = Array.from(data.songs.filter(song => song.category === 'pub'));
}
