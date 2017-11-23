exports.fixDates = function(myevents){
  for (let i = 0; i < myevents.length; i++){
    let startDate = myevents[i].voStartDate;
    let endDate = myevents[i].voEndDate;
    if (startDate !== null){
      if (startDate.indexOf('T') !== -1){
        myevents[i].voStartDate = startDate.substr(0, startDate.indexOf('T'));
      }
    }
    if (endDate !== null){
      if (endDate.indexOf('T') !== -1){
        myevents[i].voEndDate = endDate.substr(0, endDate.indexOf('T'));
      }
    }
  }
  return myevents;
};
