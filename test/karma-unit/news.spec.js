import {News} from '../../src/news';
import {RouterStub} from './commons';

describe('the News module', () => {
  let mockedRouter;
  let news1;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    news1 = new News(mockedRouter);
  });

  it('will attach', (done) => {
    news1.attached();
    expect(news1.title).toBe('Howdy is cool');
    done();
  });
});
