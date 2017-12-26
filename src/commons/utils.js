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

exports.makeFilterDropdown = function(filterName, model, attrib){
  filterName.push('');
  for (let next of model){
    let nextType = next[attrib];
    if (filterName.indexOf(nextType) === -1){
      filterName.push(nextType);
      console.log('I did it!');
      console.log(filterName);
      console.log(model);
      console.log(attrib);
    }
  }
};
