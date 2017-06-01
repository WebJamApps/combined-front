import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class UserAccount {
  constructor(app){
    this.app = app;
    this.uid = this.app.auth.getTokenPayload().sub;
    // this.volunteer = {
    //   volTravelDistMiles: 0,
    //   volCauses: ['cause1', 'cause2'],
    //   volTalents: ['talent1', 'talent2'],
    //   volWorkPrefs: ['work1', 'work2']
    // };
    this.tempCause = '';
    this.tempTalent = '';
    this.tempWork = '';
  }
  causes = ['Christian', 'Environmental', 'Hungar', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly', 'other'];
  talents = ['music', 'sports', 'childcare', 'mechanics', 'construction', 'communication', 'listening', 'other'];
  work = ['hashbrown slinger', 'hammering nails', 'leaf removal', 'other']

  async setupVolunteer(){
    if (this.tempCause !== '') {
      this.user.volCauses = [this.causes[this.tempCause - 1], 'second cause'];
    }
    if (this.tempTalent !== '') {
      this.user.volTalents = [this.talents[this.tempTalent - 1], 'second talent'];
    }
    if (this.tempWork !== '') {
      this.user.volWorkPrefs = [this.work[this.tempWork - 1], 'second work'];
    }
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'put',
      body: json(this.user)
    })
    .then((response) => response.json())
    .then((data) => {
      this.app.appState.setUser(this.user);
    });
  }

  async activate() {
    //this.uid = this.app.auth.getTokenPayload().sub;
    await this.app.appState.getUser(this.uid);
    this.user = this.app.appState.user;
    this.role = this.user.userType;
    if (this.user.userType === 'Charity'){
      this.role = 'Charity Manager';
    }
  }

  async deleteUser(){
    //let uid = this.auth.getTokenPayload().sub;
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'delete'
    })
    //.then(response=>response.json())
    .then((data) => {
      //console.log(data);
      this.app.logout();
    });
  }

}
