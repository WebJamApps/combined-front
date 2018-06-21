import { noView, inject, customElement } from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';


@noView()
@inject(Element)
@customElement('music-player')
export class MusicPlayer {
  constructor(element) {
    this.element = element;
    this.url = [
      {src: 'https://www.youtube.com/embed/ach2ubW21h4', type: 'video/webm'},
      {src: 'https://www.youtube.com/embed/mCvUBjuzfo8', type: 'video/webm'},
      {src: 'DG.mp3', type: 'audio/mpeg'},
      {src: 'MRM.mp3', type: 'audio/mpeg'},
      {src: 'AT.mp3', type: 'audio/mpeg'},
      {src: 'TTGA.mp3', type: 'audio/mpeg'}
    ];
  }

  render() {
    ReactDOM.render(<ReactPlayer url="DG.mp3" />, this.element);
  }

  bind() {
    this.render();
  }
}
