import React from 'react';
import ReactDOM from 'react-dom';
import TimeInput from 'material-ui-time-picker';
import {noView, customElement, bindable, inject} from 'aurelia-framework';

@noView()
@inject(Element)
@bindable('data')
@bindable('type')
@bindable('validator')
@customElement('time-picker')
export class TimePicker {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<TimeInput data={this.data} mode='12h' onChange={(time) => {this.updateTime(time)}}/>, this.element);
  }

  updateTime(time) {
    if (this.type === 'start') {
      this.data.voStartTime = time;
    } else {
      this.data.voEndTime = time;
    }
  }

  bind() {
    this.render();
  }
}
