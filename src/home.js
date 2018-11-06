export class Home {
  constructor() {
    this.top = null;
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }

  attached() {
    this.searchParams = new URLSearchParams(window.location.search);
    if (this.searchParams.get('reload')) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'test') window.location.href = window.location.href.split('?')[0];
    }
    this.top = document.getElementsByClassName('material-header')[0];
    if (this.top !== null && this.top !== undefined) this.top.scrollIntoView();
  }
}
