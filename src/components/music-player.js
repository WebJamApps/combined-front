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
    this.pause = this.pause.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.share = this.share.bind(this);
    this.copyShare = this.copyShare.bind(this);
    this.stop = this.stop.bind(this);
    this.playUrl = document.location.href;
    this.shown = false;
  }

  get html() {
    return (
      <div id="player" className="mb-2 row justify-content-center">
        <section id="playSection" className="col-7 mb-2" style={{display: 'inline', textAlign: 'center'}}>
          <ReactPlayer style={{backgroundColor: '#eee', textAlign: 'center'}} url={this.url} playing={this.playing} controls={true} onEnded={this.playEnd}/>
        </section>
        <section className="mt-0 col-7">
          <button onClick={this.play}>Play</button>
          <button onClick={this.pause}>Pause</button>
          <button onClick={this.stop}>Stop</button>
          <button onClick={this.shuffle}>Shuffle</button>
          <button onClick={this.share}>Share</button>
        </section>
        <section className="col-7 d-none" id="copier">
          <div className="input-group input-group-sm">
            <input id="copyUrl" disabled value={this.playUrl} style={{backgroundColor: '#fff'}} className="form-control"/>
            <div className="input-group-append" onClick={this.copyShare} style={{cursor: 'pointer'}}>
              <span className="input-group-text">Copy URL</span>
            </div>
          </div>
        </section>
        <section id="copyMessage" className="col-7 d-none">
          <span className="text-success" style={{fontSize: '0.8em'}}>Url copied Url to clipboard</span>
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
    this.play();
  }

  playEnd() {
    console.log("call this when the play has ended");
    this.next();
  }

  stop() {
    this.index = -1;
    this.url = this.urls[this.index];
    this.bind();
  }

  play() {
    this.index = 0;
    this.url = this.urls[this.index];
    this.playing = true;
    this.bind();
  }

  pause () {
    this.playing = false;
    this.bind();
  }

  next() {
    this.index += 1;
    if (this.index >= this.urls.length) {
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

  share() {
    let el = document.getElementById("copier");
    if(this.shown) {
      el.classList.add("d-none");
      this.shown = false;
    } else {
      el.classList.remove("d-none");
      this.shown = true
    }

  }

  copyShare() {

    navigator.clipboard.writeText(this.playUrl).then(res => {
      this.share();

      let el = document.getElementById("copyMessage");

      el.classList.remove('d-none');

      setTimeout(_ => {
        el.classList.add('d-none');
      }, 1500);
      
    }, err => {

    });


  }

  bind() {
    this.render();
  }
}
