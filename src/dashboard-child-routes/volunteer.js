import {inject} from 'aurelia-framework';
import {App} from '../app';
//import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
  }

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
  }

  buildCauses(){
    let causesHtml = '';
    for (let i = 0; i < this.user.volCauses.length; i++) {
      if (this.user.volCauses[i] !== ''){
        if (this.user.volCauses[i] !== 'other'){
          causesHtml = causesHtml + '<p style="font-size:10pt">' + this.user.volCauses[i] + '</p>';
        } else {
          causesHtml = causesHtml + '<p style="font-size:10pt">' + this.user.volCauseOther + '</p>';
        }
      }
    }
    //console.log('this is the causes html' + causesHtml);
    if (causesHtml === ''){
      causesHtml = '<p style="font-size:10pt">not specified</p>';
    }
    //console.log('current causes: ' + causesHtml);
    document.getElementById('causes').innerHTML = causesHtml;
  }

  buildTalents(){
    let talentsHtml = '';
    for (let i = 0; i < this.user.volTalents.length; i++) {
      if (this.user.volTalents[i] !== ''){
        if (this.user.volTalents[i] !== 'other'){
          talentsHtml = talentsHtml + '<p style="font-size:10pt">' + this.user.volTalents[i] + '</p>';
        } else {
          talentsHtml = talentsHtml + '<p style="font-size:10pt">' + this.user.volTalentOther + '</p>';
        }
      }
    }
    if (talentsHtml === ''){
      talentsHtml = '<p style="font-size:10pt">not specified</p>';
    }
    //console.log('current causes: ' + causesHtml);
    document.getElementById('talents').innerHTML = talentsHtml;
  }

  buildWorks(){
    let worksHtml = '';
    for (let i = 0; i < this.user.volWorkPrefs.length; i++) {
      if (this.user.volWorkPrefs[i] !== ''){
        if (this.user.volWorkPrefs[i] !== 'other'){
          worksHtml = worksHtml + '<p style="font-size:10pt">' + this.user.volWorkPrefs[i] + '</p>';
        } else {
          worksHtml = worksHtml + '<p style="font-size:10pt">' + this.user.volWorkOther + '</p>';
        }
      }
    }
    if (worksHtml === ''){
      worksHtml = '<p style="font-size:10pt">not specified</p>';
    }
    //console.log('current causes: ' + causesHtml);
    document.getElementById('works').innerHTML = worksHtml;
  }

  attached(){
    this.buildCauses();
    this.buildTalents();
    this.buildWorks();
  }
}
