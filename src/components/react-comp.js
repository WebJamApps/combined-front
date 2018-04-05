import React from 'react';
import ReactDOM from 'react-dom';
import ReactElement from './react-element';
import {noView, inject, customElement} from 'aurelia-framework';

@noView()
@inject(Element)
@customElement('react-component')
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
