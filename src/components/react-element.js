import React from 'react';
import ReactDOM from 'react-dom';
import ReactElement from './react-comp';
import {noView, inject, customElement} from 'aurelia-framework';

@noView()
@inject(Element)
@customElement('hello-world')
export class ReactComponent {
  constructor(element) {
    this.element = element;
  }

  render() {
    ReactDOM.render(<ReactElement/>, this.element);
  }

  bind() {
    this.render();
  }
}
