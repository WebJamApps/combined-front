import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Charity {
  constructor(app){
    this.app = app;
    this.newCharity = {
      'charityName': '',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': 0,
      'charityPhoneNumber': 0,
      'charityEmail': '',
      'charityType': [],
      'charityManagers': []
    };
  }

  //pretty much just copy and pasted the 'causes' array from user-account.js
  types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  selectedType = []
  states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

  async activate(){
    let uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);

    this.types.sort();
    this.states.sort();
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

  typePicked(){
    if (this.selectedType.length === 0){
      this.newCharity.charityType = [];
      return;
    }
    this.newCharity.charityType = this.selectedType;
  }

  createCharity(){
    this.newCharity.charityManagers[0] = this.user.name;
    //the selection menu sets this to the index of the state array, not the actual value of the state in the array.
    //so the selected index is used to get the correct state
    this.newCharity.charityState = this.states[this.newCharity.charityState - 1];
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.newCharity)
    })
    .then((data) => {
      console.log(data);
    });
  }
}
