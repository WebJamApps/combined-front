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
    this.urls = ['DG.mp3', 'MRM.mp3', 'AT.mp3', 'TTGA.mp3', 'https://soundcloud.com/joshandmariamusic/good-enough', 'https://www.youtube.com/embed/ach2ubW21h4', 'https://www.youtube.com/embed/mCvUBjuzfo8'];
    this.play = this.play.bind(this);
    this.index = 0;
    this.url = this.urls[this.index];
    this.playing = false;
    this.playEnd = this.playEnd.bind(this);
    this.stop = this.stop.bind(this);
    this.shuffle = this.shuffle.bind(this);
  }

  get html() {
    return (
      <div id="player" align="center" className="mb-2">
        <section id="playSection" style={{display: 'inline'}}>
          <ReactPlayer style={{backgroundColor: '#eee'}} url={this.url} playing={this.playing} controls={true} onEnded={this.playEnd}/>
        </section>
        <section className="mt-0">
          <button onClick={this.play}>Play</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={this.shuffle}>Shuffle</button>
        </section>
      </div>
    )
  }

  /**
   * Shuffles array in place. ES6 version
   */
  shuffle() {
    for (let i = this.urls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.urls[i], this.urls[j]] = [this.urls[j], this.urls[i]];
    }
  }

  playEnd() {
    console.log("call this when the play has ended");
    this.next();
  }

  play() {
    this.playing = true;
    this.bind();
  }

  stop () {
    this.playing = false;
    this.bind();
  }

  next() {
    this.index += 1;
    if (this.index >= this.urls.length) {
      this.playing = false;
      this.index = 0;
      this.url = this.urls[this.index];
      this.bind();
    } else {
      this.url = this.urls[this.index];
      this.bind()
    }
  }

  render() {
    ReactDOM.render(this.html, this.element);
  }

  bind() {
    this.render();
  }
}
