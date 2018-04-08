import React from 'react';
import {shallow, mount} from 'enzyme';
import renderer from 'react-test-renderer';
import ReactComponent from '../../src/components/react-comp.js';
import HelloWorld from '../../src/components/react-element.js';

describe('the App module', () => {
  let element;
  let RC;
  beforeEach(() => {
    //document.body.innerHTML = '<div><div class="home"></div></div>';
    //element = document.getElementsByClassName('home')[0];
    //console.log(element);
    //console.log(new ReactComponent());
  });
  it('RC text should be "Hello World" ', () => {
    RC = shallow(<HelloWorld />);
    expect(RC.text()).toEqual("Hello World");
  });
  it('RC text should be "Hello World" ', () => {
    // document.body.innerHTML = '<div><div class="home"></div></div>';
    // element = document.getElementsByClassName('home')[0];
    RC = mount(<react-component divElement='<div class="home"></div>'/>);
    //let component = renderer.create(<ReactComponent />);
    //console.log(component.toJSON());

    console.log(RC.html());
    expect(RC.html()).toEqual("Hello World");
  });
});
