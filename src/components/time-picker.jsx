import React from 'react';
import ReactDOM from 'react-dom';
import TimeInput from 'material-ui-time-picker';
import {
  noView,
  customElement,
  bindable,
  inject
} from 'aurelia-framework';

@noView()
@inject(Element)
@bindable('data')
@bindable('type')
@customElement('time-picker')
export class TimePicker {
  constructor(element) {
    this.element = element;
    this.updateTime = this.updateTime.bind(this);
    this.el = null;
    this.picker = null;
    this.showTimer = this.showTimer.bind(this);
  }

  get component() {
    return (
      <div>
        <div style={{ display: 'none' }}>
          <TimeInput ref={(el) => { this.picker = el; }} mode="12h" onChange={this.updateTime} />
        </div>
        <section
          ref={(el) => { this.el = el; }}
          style={{
            border: '1px solid #ccc', color: '#fff', padding: '1px 5px', width: '83%', margin: 0, outline: 0, textAlign: 'left', cursor: 'text'
          }}
          onClick={this.showTimer}
          onKeyDown={() => {}}
          role="presentation"
        >
          {this.type === 'start' ? '8:00 am' : '5:00 pm'}
        </section>
      </div>
    );
  }

  showTimer() {
    const el = this.type === 'start' ? document.querySelector('#start input') : document.querySelector('#end input');
    el.click();
  }

  render() {
    ReactDOM.render(this.component, this.element);
  }

  updateTime(time) {
    const a = time.getHours();
    const b = time.getMinutes();
    let zone, offset;
    if (a > 11 && a !== 0) {
      zone = 'pm';
    } else {
      zone = 'am';
    }
    if (a > 12 && a !== 0) {
      offset = a % 12;
    } else if (a === 12 || a === 0) {
      offset = 12;
    } else {
      offset = a;
    }
    this.data = `${offset}:${b < 10 ? `0${b}` : b} ${zone}`;
    this.el.style.color = '#000';
    this.el.innerText = this.data;
  }

  bind() {
    this.render();
  }
}
