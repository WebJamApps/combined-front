import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class UserAccount {
  constructor(app){
    this.app = app;
  }

  causes = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly', 'other'];
  talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'communication', 'listening', 'other'];
  works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'other'];
  selectedCause = [];
  selectedTalent = [];
  selectedWork = [];

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    //this.app.appState.user;
    this.role = this.user.userType;
    this.causes.sort();
    this.talents.sort();
    this.works.sort();
    if (this.user.userType === 'Charity'){
      this.role = 'Charity Manager';
    }
  }

  async setupVolunteer(){
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

  workPicked(){
    if (this.selectedWork.length === 0){
      this.user.volWorkPrefs = [];
      return;
    }
    this.user.volWorkPrefs = this.selectedWork;
    for (let i = 0; i < this.selectedWork.length; i++) {
      console.log(this.selectedWork);
      if (this.selectedWork.includes('other')){
        console.log('other was selected, we will display an additional form field now');
        this.workOther = true;
      }
    }
  }

  async deleteUser(){
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'delete'
    })
    .then((data) => {
      console.log('user has been deleted');
      this.app.logout();
    });
  }

}
