import React from 'react';
import ReactDOM from 'react-dom';
import TimeInput from 'material-ui-time-picker';
import {noView, customElement, bindable, inject} from 'aurelia-framework';

@noView()
@inject(Element)
@bindable('data')
@customElement('time-picker')
export class TimePicker {
  constructor(element) {
    this.element = element;
    this.updateTime = this.updateTime.bind(this);
  }

  render() {
    ReactDOM.render(<TimeInput mode='12h' onChange={this.updateTime}/>, this.element);
  }

  updateTime(time) {
    time = time.toISOString().split('T')[1].split(':');
    let a = parseInt(time[0], 0);
    let b = time[1].split(':')[0];
    let zone = a > 11 && a !== 0 ? 'pm' : 'am';
    let offset = a > 12 && a !== 0 ? a % 12 : a === 0 ? 12 : a;
    this.data = `${offset}:${b} ${zone}`;
  }

  bind() {
    this.render();
  }
}
