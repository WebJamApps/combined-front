// we want font-awesome to load as soon as possible to show the fa-spinner
import '../static/styles.css';
import config from './authConfig';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as Bluebird from 'bluebird';
import 'babel-polyfill';
// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export async function configure(aurelia) {
  aurelia.use
  .standardConfiguration()
  .developmentLogging();
  aurelia.use.plugin(PLATFORM.moduleName('au-table'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-view-manager'));
  //aurelia.use.plugin(PLATFORM.moduleName('aurelia-config'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-form'));
  //aurelia.use.plugin(PLATFORM.moduleName('aurelia-form-validation'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-polymer'));
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-auth'), (baseConfig)=>{
    baseConfig.configure(config);
  });

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  document.addEventListener('WebComponentsReady', function() {
    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
  });

  // await aurelia.start();
  // await aurelia.setRoot(PLATFORM.moduleName('app'));
}
