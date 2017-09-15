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
    this.canChangeUserType = true;
    //this.preventDefault = this.preventEnter.bind(this);
  }

  causes = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
  works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
  userTypes=JSON.parse(process.env.userRoles).roles;

  async activate() {
    this.canDelete = true;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    // console.log('The user details ' + this.user.userDetails);
    // if (this.user.userDetails === 'newUser'){
    //   console.log('this is a new user, we need to ask if they want to be a Charity instead of a Volunteer');
    //   //this.setNolongerNew();
    // }
    this.states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    this.states.sort();
    this.causes.sort();
    this.causes.push('other');
    for (let i = 0; i < this.causes.length; i++) {
      if (this.user.volCauses.indexOf(this.causes[i]) > -1){
        this.selectedCauses.push(this.causes[i]);
      } else {
        this.selectedCauses.push('');
      }
    }
    this.userTypes.sort();
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
    /* istanbul ignore else */
    if (this.user.userType === 'Charity' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/charity/' + this.uid);
      this.charities = await res.json();
      //console.log(this.charities);
      /* istanbul ignore else */
      if (this.charities.length !== 0){
        //loop through each charity and check if there is more than one manager
        this.canDelete = false;
        //const reason = document.getElementById('notdeletereason');
        //console.log(reason);
        //const reasonC = document.getElementsByClassName('notDelR');
        //console.log(reasonC);
        this.notDelR = 'You are not allowed to delete your account when you have a charity under management. First, delete your charities or remove yourself as manager (if there is another charity manager assigned to that charity).';
      }
    }
    if (this.user.userType === 'Reader' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/book/findcheckedout/' + this.uid);
      this.books = await res.json();
      //console.log(this.charities);
      /* istanbul ignore else */
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
    this.checkChangeUserType();
  }

  async checkChangeUserType(){
    this.reason = '';
    console.log('check change user type');
    if (this.user.userType === 'Volunteer' || this.user.userType === 'Developer'){
      await this.checkSignups();
      if (this.userSignups.length > 0){
        this.canChangeUserType = false;
        this.reason = 'you signed up to work at a charity event.';
      }
      console.log('the user signups inside the check function');
      console.log(this.userSignups);
      console.log('I can change the user type: ' + this.canChangeUserType);
    }
    if (this.user.usertype === 'Charity'){
// Do not allow user to change their primary userType away from Charity if they have created a charity
// Do not allow user to change their primary userType away from Charity if they have created an Event
    }
    if (this.user.usertype === 'Reader'){
// Do not allow user to change their primary userType away from Reader if they have a book checked out
    }
  }

  async checkSignups(){
    this.userSignups = [];
    const resp = await this.app.httpClient.fetch('/signup/' + this.uid);
    this.userSignups = await resp.json();
    //console.log('these are the signups for this user');
    //console.log(this.userSignups);
  }

  async setNolongerNew(){
    await fetch;
    this.user.userDetails = '';
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'put',
      body: json(this.user)
    })
    .then((response) => response.json())
    .then((data) => {
      this.app.appState.setUser(this.user);
      console.log('set no longer new ' +  this.user.userDetails);
    });
  }

  async setCharity(){
    await fetch;
    this.user.userDetails = '';
    this.user.userType = 'Charity';
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'put',
      body: json(this.user)
    })
    .then((response) => response.json())
    .then((data) => {
      this.app.appState.setUser(this.user);
      this.app.appState.checkUserRole();
      this.app.router.navigate('dashboard');
    });
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

  async updateUser(){
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'put',
      body: json(this.user)
    })
    .then((response) => response.json())
    .then((data) => {
      this.app.appState.setUser(this.user);
      this.app.router.navigate('dashboard');
    });
  }

  showCheckboxes(id){
    const checkboxes = document.getElementById(id);
    if (!this.expanded) {
      checkboxes.style.display = 'block';
      this.expanded = true;
    } else {
      checkboxes.style.display = 'none';
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
