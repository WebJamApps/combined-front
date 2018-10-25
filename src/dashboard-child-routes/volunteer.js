import { inject } from 'aurelia-framework';
import { App } from '../app';

const commonUtils = require('../commons/utils');
@inject(App)
export class Volunteer {
  constructor(app) {
    this.showCheckboxes = commonUtils.showCheckboxes;
    this.app = app;
    this.commonUtils = commonUtils;
    this.events = [];
    this.signup = {};
    this.selectedFilter = ['future only'];
    this.canSignup = true;
    this.hidePast = true;
    this.zipcode = false;
    this.cause = false;
    this.keyword = false;
    this.allCauses = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.allTalents = ['music', 'athletics', 'childcare', 'arts & crafts', 'mechanics',
      'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.allWorks = ['hashbrown slinging', 'word processing', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.selectedCauses = [];
    this.selectedTalents = [];
    this.selectedWorks = [];
  }

  siteLocations = [];

  causes = [];

  filterby = ['keyword', 'zipcode', 'cause', 'future only'];

  keyword = false;

  siteLocation = false;

  causeFilter = false;

  filters = [
    { filterby: 'keyword', value: '', keys: ['voName', 'voDescription', 'voCharityName', 'voContactName', 'voStreet', 'voCity', 'voState'] },
    { filterby: 'zipcode', value: '', keys: ['voZipCode'] },
    { filterby: 'cause', value: '', keys: ['voCharityTypes'] }
  ];

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    await this.fetchAllEvents();
    this.displayEvents();
    this.commonUtils.makeFilterDropdown(this.siteLocations, this.events, 'voZipCode');
    this.commonUtils.makeFilterDropdown(this.causes, this.events, 'voCharityTypes');
  }

  async displayEvents() {
    if (this.events.length > 0) {
      this.fixZipcodesAndTypes();
      this.commonUtils.fixDates(this.events);
      this.app.buildPTag(this.events, 'voWorkTypes', 'voWorkTypeOther ', 'workHtml');
      this.app.buildPTag(this.events, 'voTalentTypes', 'voTalentTypeOther', 'talentHtml');
      this.checkScheduled();
      this.commonUtils.markPast(this.events, this.commonUtils.formatDate);
    }
  }

  async fetchAllEvents() {
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events = await res.json();
  }

  checkScheduled() {
    for (let i = 0; i < this.events.length; i += 1) {
      this.events[i].voNumPeopleScheduled = 0;
      this.events[i].scheduled = false;
      this.events[i].full = false;
      if (this.events[i].voPeopleScheduled !== null && this.events[i].voPeopleScheduled !== undefined) {
        this.events[i].voNumPeopleScheduled = this.events[i].voPeopleScheduled.length;
        if (this.events[i].voPeopleScheduled.includes(this.uid)) {
          this.events[i].scheduled = true;
        }
      }
      if (this.events[i].voNumPeopleScheduled >= this.events[i].voNumPeopleNeeded) {
        this.events[i].full = true;
      }
    }
  }

  fixZipcodesAndTypes() {
    for (let i = 0; i < this.events.length; i += 1) {
      if (this.events[i].voZipCode === undefined || this.events[i].voZipCode === '' || this.events[i].voZipCode === null) {
        this.events[i].voZipCode = '00000';
      }
      if (this.events[i].voCharityTypes === undefined || this.events[i].voCharityTypes === null || this.events[i].voCharityTypes.length === 0) {
        this.events[i].voCharityTypes = ['not specified'];
      }
    }
  }

  filterPicked() {
    this.commonUtils.filterSelected(this);
    if (this.selectedFilter.includes('future only')) {
      this.commonUtils.markPast(this.events, this.commonUtils.formatDate);
      this.hidePast = true;
    } else {
      this.hidePast = false;
    }
  }

  async signupEvent(thisevent) {
    const result = await this.doubleCheckSignups(thisevent);
    if (this.canSignup) {
      thisevent.voPeopleScheduled.push(this.uid);
      this.app.updateById('/volopp/', thisevent._id, thisevent);
      await this.fetchAllEvents();
      this.checkScheduled();
      this.app.router.navigate('dashboard');
      return Promise.resolve(thisevent);
    }
    return Promise.resolve(result);
  }

  async cancelSignup(thisevent) {
    thisevent.voPeopleScheduled = thisevent.voPeopleScheduled.filter(e => e !== this.uid);
    await this.app.updateById('/volopp/', thisevent._id, thisevent);
    this.app.router.navigate('dashboard');
  }

  doubleCheckSignups(thisevent) {
    // get this event, check if start date is in past, check if max signups are already reached
    return this.app.httpClient.fetch(`/volopp/get/${thisevent._id}`)
      .then(response => response.json())
      .then((data) => {
        if (data.voStartDate) {
          let today = new Date(), testDate = data.voStartDate.replace('-', '');
          today = this.commonUtils.formatDate(today);
          testDate = testDate.replace('-', '');
          if (testDate < today) {
            alert('this event has already started');
            this.canSignup = false;
          }
        }
        if (data.voPeopleScheduled) {
          if (data.voPeopleScheduled.length >= data.voNumPeopleNeeded) {
            alert('this event has already reached max volunteers needed');
            this.canSignup = false;
          }
        }
      }).catch((error) => {
        this.canSignup = false;
        return error;
      });
  }

  selectPickChange(type) {
    this.showButton();
    if (type === 'causes') {
      this.app.selectPickedChange(this.user, this, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
      this.selectedCauses = this.selectedCauses.filter(e => e !== '');
    }
    if (type === 'work') {
      this.app.selectPickedChange(this.user, this, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
      this.selectedWorks = this.selectedWorks.filter(e => e !== '');
    }
    if (type === 'talents') {
      this.app.selectPickedChange(this.user, this, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
      this.selectedTalents = this.selectedTalents.filter(e => e !== '');
    }
    if (this.selectedCauses.length === 0) {
      this.hideCheckBoxes('selectCauses');
    }
    if (this.selectedTalents.length === 0) {
      this.hideCheckBoxes('selectTalents');
    }
    if (this.selectedWorks.length === 0) {
      this.hideCheckBoxes('selectWork');
    }
  }

  hideCheckBoxes(id) {
    const checkboxes = document.getElementById(id);
    if (checkboxes.style.display === 'block') {
      checkboxes.style.display = 'none';
    }
  }

  setupVolunteerUser() {
    this.changeCauses(this.allCauses, this.user.volCauses, this.selectedCauses);
    this.selectedCauses = this.selectedCauses.filter(e => e !== '');
    this.changeCauses(this.allTalents, this.user.volTalents, this.selectedTalents);
    this.selectedTalents = this.selectedTalents.filter(e => e !== '');
    this.changeCauses(this.allWorks, this.user.volWorkPrefs, this.selectedWorks);
    this.selectedWorks = this.selectedWorks.filter(e => e !== '');
    this.workOther = this.selectedWorks.includes('other');
    this.talentOther = this.selectedTalents.includes('other');
    this.causeOther = this.selectedCauses.includes('other');
    if (this.selectedCauses.length > 0) {
      document.getElementById('causesSelector').click();
    }
    if (this.selectedTalents.length > 0) {
      document.getElementById('talentsSelector').click();
    }
    if (this.selectedWorks.length > 0) {
      document.getElementById('worksSelector').click();
    }
  }

  /* istanbul ignore next */
  reload() {
    window.location.reload();
  }

  changeCauses(item, vol, container) {
    item.sort();
    item.push('other');
    for (const i of item) {
      if (vol.includes(i)) {
        container.push(i);
      } else {
        container.push('');
      }
    }
  }

  async updateUser() {
    await this.app.updateById('/user/', this.uid, this.user);
    await this.activate();
    this.reload();
  }

  showButton() {
    document.getElementById('updateUserButton').style.display = 'block';
  }

  attached() {
    document.getElementById('distanceInput').addEventListener('keydown', this.showButton);
    this.setupVolunteerUser();
    if (document.documentElement.clientWidth < 766) {
      document.getElementsByClassName('checkboxes-div')[0].style.top = '124px';
    }
  }
}
