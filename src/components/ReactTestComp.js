import React from 'react';
import ReactDOM from 'react-dom';
import HelloWorld from './HelloWorld';
import {noView, inject, customElement, bindable} from 'aurelia-framework';

@noView()
@inject(Element)
@customElement('react-testcomp')
export class ReactTest {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<HelloWorld/>, this.element);
  }

  bind() {
    this.render();
  }
}
