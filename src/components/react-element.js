import React from 'react';
import ReactDOM from 'react-dom';
import HWComp from './react-comp';
import {noView, inject, customElement} from 'aurelia-framework';

@noView()
@inject(Element)
@customElement('hello-world')
export class HelloWorld {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<HWComp/>, this.element);
  }

  bind() {
    this.render();
  }
}
