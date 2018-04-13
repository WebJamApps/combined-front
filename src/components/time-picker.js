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
    ReactDOM.render(<TimeInput defaultValue={new Date(0)} data={this.data} mode='12h' onChange={(time) => {this.updateTime(time);}}/>, this.element);
  }

  updateTime(time) {
    time = time.toISOString().split('T')[1].split('Z')[0];
    if (this.type === 'start') {
      this.data.voStartTime = time;
    } else {
      this.data.voEndTime = time;
    }
    this.showScheduleButton();
  }

  showScheduleButton() {
    let data = this.data;
    if (data.voName && data.voStartTime && data.voEndTime && data.voNumPeopleNeeded && data.voStartDate && data.voEndDate && data.voState && data.voCity && data.voStreet && data.voZipCode) {
      document.getElementById('scheduleEvent').style.display = 'block';
    }
  }

  bind() {
    this.render();
  }
}
