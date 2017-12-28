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
    }
  }
};

exports.filterSelected = function(myModule){
  console.log('trying to filter please');
  if (myModule.selectedFilter.length === 0){
    console.log('no filters');
    for (let i = 0; i < myModule.filters.length; i++){
      myModule.filters[i].value = '';
      myModule[myModule.filters[i].filterby] = false;
      //myModule.filters[i].showFilter = false;
    }
    return;
  }
  for (let s = 0; s < myModule.filters.length; s++){
    console.log('I picked a filter:');
    console.log(myModule.selectedFilter[0]);
    for (let u = 0; u < myModule.selectedFilter.length; u++){
      console.log('inside this loop');
      console.log(myModule.filters[s].filterby);
      console.log(myModule.selectedFilter[u]);
      //arrayFilters[u].showFilter = false;
      if (myModule.filters[s].filterby === myModule.selectedFilter[u]){
        console.log('I have a match');
        myModule[myModule.filters[s].filterby] = true;
      } else {
        myModule.filters[s].value = '';
        myModule[myModule.filters[s].filterby] = false;
      }
    }
  }
  // for (let t = 0; t < arrayFilters.length; t++){
  //   if (arrayFilters[t].showFilters === false){
  //     arrayFilters[t].value = '';
  //   }
  // }
};
