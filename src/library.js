import {bindable} from 'aurelia-framework';

export class Library {

  @bindable
  columnWidth = '450px';

  get widescreen(){
    return document.documentElement.clientWidth > 1000;
    // let iswidescreen = false;
    // let currentscreenwidth = document.documentElement.clientWidth;
    // if (currentscreenwidth > 1000){
    //   iswidescreen = true;
    //   this.columnWidth = '450px';
    // } else {
    //   this.columnWidth = 'auto';
    // }
    // return iswidescreen;
  }
}
