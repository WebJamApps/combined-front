import { inject } from 'aurelia-framework';
import { App } from './app';

const dashboardUtils = require('./commons/dashboardUtils');
@inject(App)
export class Dashboard {
  constructor(app) {
    this.app = app;
    this.dashboardUtils = dashboardUtils;
  }

  async activate() {
    this.dashboardUtils.subRoute(this, window.localStorage);
  }
}
