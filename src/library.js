import {bindable} from 'aurelia-framework';

export class Library {

  @bindable
  columnWidth = '450px';

  get widescreen(){
    let iswidescreen = false;
    let currentscreenwidth = document.documentElement.clientWidth;
    /* istanbul ignore else */
    if (currentscreenwidth > 1000){
      iswidescreen = true;
      this.columnWidth = '450px';
    } else {
      this.columnWidth = 'auto';
    }
    return iswidescreen;
  }
}
