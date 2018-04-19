import React from 'react';
import ReactDOM from 'react-dom';
import TimeInput from 'material-ui-time-picker';
import {noView, customElement, bindable, inject} from 'aurelia-framework';

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
    this.showTimer = this.showTimer.bind(this);
  }

  get component() {
    return (
      <div>
        <div style={{display: 'none'}}><TimeInput mode='12h' onChange={this.updateTime}/></div>
        <section ref={(el) => {this.el = el;}} style={{border: '1px solid #ccc', color: '#fff', padding: '1px 5px', width: '83%', margin: 0, outline: 0, textAlign: 'left', cursor: 'text'}} onClick={this.showTimer}>{this.type === 'start' ? '8:00 am' : '5:00 pm'}</section>
      </div>
    );
  }

  showTimer() {
    let el = this.type === 'start' ? document.querySelector('#start input') : document.querySelector('#end input');
    el.click();
  }

  render() {
    ReactDOM.render(this.component, this.element);
  }

  updateTime(time) {
    let tz = time.getTimezoneOffset();
    console.log(tz);
    time = time.toISOString().split('T')[1].split(':');
    let a = parseInt(time[0], 0);
    let b = time[1].split(':')[0];
    let zone = a > 11 && a !== 0 ? 'pm' : 'am';
    let offset = a > 12 && a !== 0 ? (a % 12) - tz : a === 0 ? 12 - tz : a - tz;
    this.data = `${offset}:${b} ${zone}`;
    this.el.style.color = '#000';
    this.el.innerText = this.data;
  }

  bind() {
    this.render();
  }
}
