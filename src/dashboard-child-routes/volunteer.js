import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.volunteer = {
      volFKuserID: this.uid,
      volTravelDistMiles: 0,
      volCauses: ['cause1', 'cause2'],
      volTalents: ['talent1', 'talent2'],
      volWorkPrefs: ['work1', 'work2']
    };
    this.tempCause = '';
    this.tempTalent = '';
    this.tempWork = '';
  }
  causes = ['Christian', 'Environmental', 'Hungar', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly', 'other'];
  talents = ['music', 'sports', 'childcare', 'mechanics', 'construction', 'communication', 'listening', 'other'];
  work = ['hashbrown slinger', 'hammering nails', 'leaf removal', 'other']
  // const volunteerSchema = new Schema({
  //   volFKuserID: { type: String, required: true },
  //   volTravelDistMiles: { type: Number, required: false },
  //   volCauses: { type: [String], required: false },
  //   volTalents: { type: [String], required: false },
  //   volWorkPrefs: { type: [String], required: false }
  // });
  //async activate() {
  //let uid = this.app.auth.getTokenPayload().sub;
  //await this.app.appState.getUser(uid);
  //this.user = this.app.appState.user;
  //   console.log('this is the user ' + this.app.appState.user.name);
  //   this.userType = this.app.appState.user.userType;
  //   this.doubleCheckUserRole();
  createVolunteer(){
    if (this.tempCause !== '') {
      this.volunteer.volCauses = [this.causes[this.tempCause - 1], 'second cause'];
    }
    if (this.tempTalent !== '') {
      this.volunteer.volTalents = [this.talents[this.tempTalent - 1], 'second talent'];
    }
    if (this.tempCause !== '') {
      this.volunteer.volWorkPrefs = [this.work[this.tempWork - 1], 'second work'];
    }
    this.app.httpClient.fetch('/volunteer/create', {
      method: 'post',
      body: json(this.volunteer)
    })
    .then((data) => {
      console.log(data);
    });
  }
}
