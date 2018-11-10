const sinon = require('sinon');
const filesaver = require('file-saver');
const utils = require('../../src/commons/utils');
const showSlides = require('../../src/commons/showSlides');

describe('the common utils', () => {
  beforeEach((done) => {
    jest.useFakeTimers();
    done();
  });
  it('starts a slide show', (done) => {
    sMock = sinon.mock(showSlides);
    sMock.expects('showSlides').returns(true);
    utils.startSlides(['1', '2', '3']);
    jest.advanceTimersByTime(5400);
    sMock.restore();
    done();
  });
  it('makes a tab delimted text file', async () => {
    let cb;
    const fMock = sinon.mock(filesaver);
    fMock.expects('saveAs').resolves(true);
    try {
      cb = await utils.makeCSVfile({ fetch() { return Promise.resolve({ json() { return Promise.resolve({}); } }); } }, '', '');
      expect(cb).toBe(true);
    } catch (e) { throw e; }
    fMock.restore();
  });
});
