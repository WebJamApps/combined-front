import {
  noView, inject, customElement, bindable
} from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';

@noView()
@inject(Element)
@bindable('data')
@bindable('copy')
@customElement('music-player')
export class MusicPlayer {
  constructor(element) {
    this.element = element;
    this.play = this.play.bind(this);
    this.index = 0;
    this.playing = false;
    this.playEnd = this.playEnd.bind(this);
    this.pause = this.pause.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.share = this.share.bind(this);
    this.copyShare = this.copyShare.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.playUrl = `${document.location.href}?oneplayer=true`;
    this.shown = false;
    this.navigator = navigator;
    this.isShuffleOn = false;
  }

  get html() {
    return (
      <div className="container-fluid">
        <div id="player" className="mb-2 row justify-content-center">
          <section id="playSection" className="col-12 mt-2 mr-0 col-md-7" style={{ display: 'inline', textAlign: 'center' }}>
            <ReactPlayer
              style={{ backgroundColor: '#eee', textAlign: 'center' }}
              url={this.url[0]}
              playing={this.playing}
              controls
              onEnded={this.playEnd}
              width="100%"
              id="mainPlayer"
              config={{ file: { attributes: { controlsList: 'nodownload' } } }}
            />
          </section>
          <section className="col-12 row col-md-7 m-0 mt-2 d-none" id="copier">
            <div className="col-8 col-sm-8 col-md-9 p-0">
              <input id="copyUrl" disabled value={this.playUrl} style={{ backgroundColor: '#fff' }} className="form-control" />
            </div>
            <div
              className="col-4 col-sm-4 col-md-3 p-0 text-md-center"
              onKeyPress={this.pressKey}
              role="presentation"
              onClick={this.copyShare}
              style={{ cursor: 'pointer' }}
            >
              <span className="input-group-text" id="inputGroup" style={{ fontSize: '0.8em', padding: '0.65em' }}>
Copy URL
              </span>
            </div>
          </section>
          <section id="copyMessage" className="col-12 col-md-7 d-none m-0">
            <span className="text-success" style={{ fontSize: '0.8em' }}>
Url copied Url to clipboard
            </span>
          </section>
          <section className="col-12 col-md-7 mt-1" style={{ fontSize: '0.8em' }}>
            {this.url[1]}
          </section>
          <section className="mt-0 col-12 col-md-7">
            <button id="play-pause" role="menu" onClick={this.play}>
Play/Pause
            </button>
            <br className="d-md-none" />
            <button role="menu" onClick={this.next}>
Next
            </button>
            <br className="d-md-none" />
            <div className="d-md-none" />
            <button role="menu" onClick={this.prev}>
Prev
            </button>
            <br className="d-md-none" />
            <button id="shuffle" role="menu" onClick={this.shuffle}>
Shuffle
            </button>
            <br className="d-md-none" />
            <button role="menu" onClick={this.share}>
Share
            </button>
          </section>
        </div>
      </div>
    );
  }

  pressKey() {}

  /**
   * Shuffles array in place. ES6 version
   */
  shuffle() {
    if (this.isShuffleOn) {
      this.urls = this._urls;
      this.isShuffleOn = false;
      document.getElementById('shuffle').classList.remove('on');
    } else {
      this.urls = this.urls.slice();
      for (let i = this.urls.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.urls[i], this.urls[j]] = [this.urls[j], this.urls[i]];
      }
      document.getElementById('shuffle').classList.add('on');
      this.isShuffleOn = true;
    }
    this.index = 0;
    this.url = this.urls[this.index];
    this.bind();
  }

  playEnd() {
    this.next();
  }

  playTrue() {
    this.bind();
  }

  prev() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = this.urls.length - 1;
      this.url = this.urls[this.index];
    } else {
      this.url = this.urls[this.index];
    }
    this.playTrue();
  }

  play() {
    this.playing = !this.playing;
    if (this.playing) {
      document.getElementById('play-pause').classList.remove('off');
      document.getElementById('play-pause').classList.add('on');
    } else {
      document.getElementById('play-pause').classList.remove('on');
      document.getElementById('play-pause').classList.add('off');
    }
    this.bind();
  }

  pause() {
    this.playing = false;
    this.bind();
  }

  next() {
    this.index += 1;
    if (this.index >= this.urls.length) {
      this.index = 0;
      this.url = this.urls[this.index];
    } else {
      this.url = this.urls[this.index];
    }
    this.playTrue();
  }

  render() {
    ReactDOM.render(this.html, this.element);
  }

  share() {
    const el = document.getElementById('copier');
    if (this.shown) {
      el.classList.add('d-none');
      this.shown = false;
    } else {
      el.classList.remove('d-none');
      this.shown = true;
    }
  }

  copyShare() {
    this.navigator.clipboard.writeText(this.playUrl).then(() => {
      this.share();

      const el = document.getElementById('copyMessage');

      el.classList.remove('d-none');

      setTimeout(() => {
        el.classList.add('d-none');
      }, 1500);
    });
  }

  bind() {
    if (!this.urls || !this._urls) {
      this.urls = this.data;
      this._urls = this.copy;
      this.url = this.urls[this.index];
    }

    this.render();
  }
}
