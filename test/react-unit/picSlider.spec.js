import React from 'react';
import { PicSlider } from '../../src/components/pic-slider';

describe('the App module', () => {
  let ps;

  beforeEach(() => {
    document.body.innerHTML = '<div id="renderer" class="swipe-area"></div>';
    ps = new PicSlider();
    ps.data = [
      '../static/imgs/ohaf/slideshow2.png',
      '../static/imgs/ohaf/slideshow3.png',
      '../static/imgs/ohaf/slideshow4.png',
      '../static/imgs/ohaf/slideshow5.png',
      '../static/imgs/ohaf/slideshow6.png'
    ];
    ps.element = document.getElementById('renderer');
  });

  it('get html text', (done) => {
    const html = ps.html();
    expect(typeof html).toBe('object');
    done();
  });
});
