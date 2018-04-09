import React from 'react';
import ReactDOM from 'react-dom';
import TimeInput from 'material-ui-time-picker';
import {noView, customElement, inject} from 'aurelia-framework';

@noView()
@inject(Element)
@customElement('time-picker')
export class TimePicker {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<TimeInput mode='12h' onChange={(time) => {console.log(time);}} />, this.element);
  }

  bind() {
    this.render();
  }
}
