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
    this.playing = false;
    this.play = this.play.bind(this);
  }

  get html() {
    return (
      <div id="player" align="center" className="mb-2">
        <section id="playSection" style={{display: 'inline'}}>
          <ReactPlayer style={{backgroundColor: '#eee'}} url={this.url} playing={true} />
        </section>
        <section className="mt-0">
          <button onClick={this.play}>Play</button>
          <button>Stop</button>
          <button>Shuffle</button>
        </section>
      </div>
    )
  }

  play() {
    this.playing = true;
  }

  render() {
    ReactDOM.render(this.html, this.element);
  }

  bind() {
    this.render();
  }
}
