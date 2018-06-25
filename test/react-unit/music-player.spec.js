import {MusicPlayer} from "../../src/components/music-player";


describe('++MusicPlayer tests', () => {
  let mp;

  beforeEach(() => {
    mp = new MusicPlayer();
  });

  it('should just log mp', () => {
    console.log(mp);
  });

});
