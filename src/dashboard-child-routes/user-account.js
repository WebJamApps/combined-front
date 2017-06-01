import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class UserAccount {
  constructor(app){
    this.app = app;
    this.tempWork = '';
  }
  causes = ['Christian', 'Environmental', 'Hungar', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly', 'other'];
  talents = ['music', 'sports', 'childcare', 'mechanics', 'construction', 'communication', 'listening', 'other'];
  work = ['hashbrown slinger', 'hammering nails', 'leaf removal', 'other']
  selectedCause = [];
  selectedTalent = [];

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    await this.app.appState.getUser(this.uid);
    this.user = this.app.appState.user;
    this.role = this.user.userType;
    if (this.user.userType === 'Charity'){
      this.role = 'Charity Manager';
    }
  }

  async setupVolunteer(){
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
      this.app.router.navigate('dashboard/volunteer');
    });
  }

  showCheckboxes(id){
    const checkboxes = document.getElementById(id);
    if (!this.expanded) {
      checkboxes.opened = true;
      this.expanded = true;
    } else {
      checkboxes.opened = false;
      this.expanded = false;
    }
  }

  causePicked(){
    if (this.selectedCause.length === 0){
      this.user.volCauses = [];
      return;
    }
    this.user.volCauses = this.selectedCause;
    for (let i = 0; i < this.selectedCause.length; i++) {
      console.log(this.selectedCause);
      if (this.selectedCause.includes('other')){
        console.log('other was selected, we will display an additional form field now');
        this.causeOther = true;
      }
    }
  }

  talentPicked(){
    if (this.selectedTalent.length === 0){
      this.user.volTalents = [];
      return;
    }
    this.user.volTalents = this.selectedTalent;
    for (let i = 0; i < this.selectedTalent.length; i++) {
      console.log(this.selectedTalent);
      if (this.selectedTalent.includes('other')){
        console.log('other was selected, we will display an additional form field now');
        this.talentOther = true;
      }
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
