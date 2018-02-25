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

exports.formatDate = function(today){
  //console.log(today);
  let mm = today.getMonth() + 1; // getMonth() is zero-based
  let dd = today.getDate();
  today = [today.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd].join('');
  return today;
};

exports.markPast = function(myEvents, formatDate) {
  let testDate;
  let today = new Date();
  today = formatDate(today);
  for (let i = 0; i < myEvents.length; i++){
    if (myEvents[i].voStartDate === undefined || myEvents[i].voStartDate === null || myEvents[i].voStartDate === ''){
      myEvents[i].voStartDate = today;
    }
    testDate = myEvents[i].voStartDate.replace('-', '');
    testDate = testDate.replace('-', '');
    if (testDate <= today){
      myEvents[i].past = true;
    } else {
      myEvents[i].past = false;
    }
  }
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
  for (let s = 0; s < myModule.selectedFilter.length; s++){
    console.log('I picked a filter:');
    //console.log(myModule.selectedFilter[0]);
    for (let u = 0; u < myModule.filters.length; u++){
      console.log('inside this loop');
      console.log(myModule.filters[u].filterby);
      console.log(myModule.selectedFilter[s]);
      //myModule[myModule.filters[u].filterby] = false;
      if (myModule.filters[u].filterby === myModule.selectedFilter[s]){
        console.log('I have a match');
        myModule[myModule.filters[u].filterby] = true;
      }
    }
  }
  console.log('these are the selected filters');
  console.log(myModule.selectedFilter);
  for (let a = 0; a < myModule.filters.length; a++){
    if (myModule.selectedFilter.indexOf(myModule.filters[a].filterby) === -1){
      myModule[myModule.filters[a].filterby] = false;
      myModule.filters[a].value = '';
    }
  }
  // for (let z = 0; z < myModule.filters.length; z++){
  //   if(myModule[myModule.filters[z].filterby] = true;)
  // for (let t = 0; t < arrayFilters.length; t++){
  //   if (arrayFilters[t].showFilters === false){
  //     arrayFilters[t].value = '';
  //   }
  // }
};


exports.showSlides = function(idArray) {
  idArray.forEach(function(id){
    let slides;
    slides = document.getElementById(id);
    if (slides !== null){
      $('#' + id + ' > div:first')
        .hide()
        .next()
        .fadeIn(1500)
        .end()
        .appendTo('#' + id);
    }
  });
};

exports.startSlides = function(idArray1, errorMsg, idArray2){
  let slideshowTimer = setInterval(function(){
    let foundElement = false;
    idArray1.forEach(function(id){
      let tempMS = document.getElementById(id);
      if(tempMS !== null && tempMS !== undefined){
        tempMS.style.display = 'none';
      }else{
        foundElement = true;
      }
    });
    if(!(foundElement)){
      console.log(errorMsg);
      return clearInterval(slideshowTimer);
    }
    exports.showSlides(idArray2);
  }, 5400);
};
