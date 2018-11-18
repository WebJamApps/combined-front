import { noView, inject, customElement, bindable } from 'aurelia-framework';
import { Slideshow } from "react-slidez/src";
import React from 'react';
import ReactDOM from 'react-dom';

@noView()
@inject(Element)
@customElement('picture-slider')
@bindable('data')
export class HelloWorld {
  constructor(element) {
    this.element = element;
  }

  get html() {
    return (
      <div>
        <Slideshow slides={this.data} />
      </div>
    )
  }

  render() {
    ReactDOM.render(this.html, this.element);
  }

  bind() {
    console.log(this.data);
    this.render();
  }
}
