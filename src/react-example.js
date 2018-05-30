
export class ReactExample {
  constructor() {
    this.reactElementInner = null;
  }

  attached() {
    // console.log(document.getElementsByClassName('here')[0].children[0].innerHTML);
    this.reactElementInner = document.getElementsByClassName('here')[0].children[0].innerHTML;
    // console.log(this.reactElementInner);
  }
}
