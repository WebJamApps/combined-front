import { MusicRouter } from '../../src/music-router';

function log(array) {
  console.log(array);
}

const config = {
  map: log
};

describe('the Dashboard Module', () => {
  let msRouter;
  beforeEach(() => {
    msRouter = new MusicRouter();
  });

  it('confirm heading', (done) => {
    expect(msRouter.heading).toBe('Music Router');
    done();
  });

  it('configureRouter', (done) => {
    msRouter.configureRouter(config, 'router');
    done();
  });
});
