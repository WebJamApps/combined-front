const React = require('react');
//const ReactDOM = require('react-dom');

export class ReactComp extends React.Component {
  //constructor(){}
  render() {
    return React.createElement('h3', null, 'Hello World');
  }
}

//ReactDOM.render(<ReactComp />, document.getElementsByClassName('page-content')[0]);

//module.exports = ReactComp;
