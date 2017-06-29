import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class UserAccount {
  constructor(app){
    this.app = app;
    this.selectedCauses = [];
    this.selectedTalents = [];
    this.selectedWorks = [];
  }

  causes = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
  works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];

  async activate() {
    this.canDelete = true;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.role = this.user.userType;
    this.causes.sort();
    this.causes.push('other');
    for (let i = 0; i < this.causes.length; i++) {
      if (this.user.volCauses.indexOf(this.causes[i]) > -1){
        this.selectedCauses.push(this.causes[i]);
      } else {
        this.selectedCauses.push('');
      }
    }
    //console.log('the selected causes are: ' + this.selectedCauses);
    this.talents.sort();
    this.talents.push('other');
    for (let i = 0; i < this.talents.length; i++) {
      if (this.user.volTalents.indexOf(this.talents[i]) > -1){
        this.selectedTalents.push(this.talents[i]);
      } else {
        this.selectedTalents.push('');
      }
    }
    //console.log('the selected talents are: ' + this.selectedTalents);
    this.works.sort();
    this.works.push('other');
    for (let i = 0; i < this.works.length; i++) {
      if (this.user.volWorkPrefs.indexOf(this.works[i]) > -1){
        this.selectedWorks.push(this.works[i]);
      } else {
        this.selectedWorks.push('');
      }
    }
    //console.log('the selected talents are: ' + this.selectedTalents);
    if (this.user.userType === 'Charity'){
      this.role = 'Charity Manager';
    }
    if (this.user.userType === 'Charity' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/charity/' + this.uid);
      this.charities = await res.json();
      console.log(this.charities);
      if (this.charities.length !== 0){
        //loop through each charity and check if there is more than one manager
        this.canDelete = false;
        //const reason = document.getElementById('notdeletereason');
        //console.log(reason);
        //const reasonC = document.getElementsByClassName('notDelR');
        //console.log(reasonC);
        this.notDelR = 'You are not allowed to delete your account when you are a charity manager. First, delete your charities or remove yourself as manager (if there is another charity manager assigned to that charity).';
      }
    }
    if (this.user.userType === 'Reader' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/book/findcheckedout/' + this.uid);
      this.books = await res.json();
      console.log(this.charities);
      if (this.books.length !== 0){
        this.canDelete = false;
        this.notDelB = 'You are not allowed to delete your account when you have a book checked out';
      }
    }

    if (this.selectedWorks.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.workOther = true;
    } else {
      this.workOther = false;
    }

    if (this.selectedTalents.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.talentOther = true;
    } else {
      this.talentOther = false;
    }
    if (this.selectedCauses.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.causeOther = true;
    } else {
      this.causeOther = false;
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
    this.user.volCauses = this.selectedCauses;
    //for (let i = 0; i < this.selectedCauses.length; i++) {
    //console.log(this.selectedCauses);
    if (this.selectedCauses.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.causeOther = true;
    } else {
      this.causeOther = false;
      this.user.volCauseOther = '';
    }
    //}
  }

  talentPicked(){
    this.user.volTalents = this.selectedTalents;
    //for (let i = 0; i < this.selectedTalents.length; i++) {
    //console.log(this.selectedTalents);
    if (this.selectedTalents.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.talentOther = true;
    } else {
      this.talentOther = false;
      this.user.volTalentOther = '';
    }
    //  }
  }

  workPicked(){
    this.user.volWorkPrefs = this.selectedWorks;
    //for (let i = 0; i < this.selectedWorks.length; i++) {
    //console.log(this.selectedWorks);
    if (this.selectedWorks.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.workOther = true;
    } else {
      this.workOther = false;
      this.user.volWorkOther = '';
    }
    //  }
  }

  async deleteUser(){
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'delete'
    })
    .then((data) => {
      //console.log('user has been deleted');
      this.app.logout();
    });
  }

}
