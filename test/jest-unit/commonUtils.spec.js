const sinon = require('sinon');
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
});
