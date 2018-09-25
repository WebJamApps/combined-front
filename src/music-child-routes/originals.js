import data from '../../config.json';


export class Originals {
  urls = data.songs.filter(song => song.category === 'original');
  _urls = Array.from(data.songs.filter(song => song.category === 'original'));
}
