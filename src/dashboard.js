import { inject } from 'aurelia-framework';
import { App } from './app';
@inject(App)
export class Dashboard {
  constructor(app) {
    this.app = app;
  }

  async activate() {
    try {
      this.uid = this.app.auth.getTokenPayload().sub;
    } catch (e) { this.app.logout(); }
    this.user = await this.app.appState.getUser(this.uid);
    window.localStorage.setItem('userEmail', this.user.email);
    this.childRoute();
  }

  childRoute() {
    if (this.user.userStatus === 'disabled') {
      return this.app.router.navigate('dashboard/user-account');
    }
    if (this.user.userType === undefined || this.user.userType === '') {
      this.user.userDetails = 'newUser';
      if (this.user.isOhafUser) {
        this.user.userType = 'Volunteer';
      } else {
        this.user.userType = 'user-account';
      }
      this.app.appState.setUser(this.user);
      return this.app.router.navigate('dashboard/user-account');
    }
    return this.app.router.navigate(`dashboard/${this.user.userType.toLowerCase()}`);
  }
}
