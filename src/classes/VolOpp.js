export class VolOpp {
  constructor(){
    this.updateScheduleEvent = false;
  }

  async buildEvents(){
    for (let l = 0; l < this.charities.length; l++){
      let eventHtml = '';
      this.events = [];
      console.log('these are the charity ids');
      console.log(this.charities[l]._id);
      let res = await this.app.httpClient.fetch('/volopp/' + this.charities[l]._id);
      this.events = await res.json();
      eventHtml = this.events;
      this.charities[l].eventHtml = eventHtml;
    }
  }
}
