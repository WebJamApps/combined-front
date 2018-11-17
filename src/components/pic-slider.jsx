import { noView, inject, customElement, bindable } from 'aurelia-framework';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Slideshow from 'react-slidez'

@noView()
@inject(Element)
@customElement('picture-slider')
@bindable('data')
export class HelloWorld {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<Slideshow slides={this.data} />, this.element);
  }

  bind() {
    this.render();
  }
}
