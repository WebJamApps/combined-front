exports.fixDates = function (myevents) {
  for (let i = 0; i < myevents.length; i += 1) {
    const startDate = myevents[i].voStartDate;
    const endDate = myevents[i].voEndDate;
    if (startDate !== null) {
      if (startDate.indexOf('T') !== -1) {
        myevents[i].voStartDate = startDate.substr(0, startDate.indexOf('T'));
      }
    }
    if (endDate !== null) {
      if (endDate.indexOf('T') !== -1) {
        myevents[i].voEndDate = endDate.substr(0, endDate.indexOf('T'));
      }
    }
  }
  return myevents;
};

exports.formatDate = function (today) {
  // console.log(today);
  const mm = today.getMonth() + 1; // getMonth() is zero-based
  const dd = today.getDate();
  today = [today.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd].join('');
  return today;
};

exports.markPast = function (myEvents, formatDate) {
  let testDate, today = new Date();
  today = formatDate(today);
  for (let i = 0; i < myEvents.length; i += 1) {
    if (myEvents[i].voStartDate === undefined || myEvents[i].voStartDate === null || myEvents[i].voStartDate === '') {
      myEvents[i].voStartDate = today;
    }
    testDate = myEvents[i].voStartDate.replace('-', '');
    testDate = testDate.replace('-', '');
    if (testDate <= today) {
      myEvents[i].past = true;
    } else {
      myEvents[i].past = false;
    }
  }
};

exports.makeFilterDropdown = function (filterName, model, attrib) {
  filterName.push('');
  for (const next of model) {
    const nextType = next[attrib];
    if (filterName.indexOf(nextType) === -1) {
      filterName.push(nextType);
    }
  }
};

exports.filterSelected = function (myModule) {
  console.log('trying to filter please');
  if (myModule.selectedFilter.length === 0) {
    console.log('no filters');
    for (let i = 0; i < myModule.filters.length; i += 1) {
      myModule.filters[i].value = '';
      myModule[myModule.filters[i].filterby] = false;
      // myModule.filters[i].showFilter = false;
    }
    return;
  }
  for (let s = 0; s < myModule.selectedFilter.length; s += 1) {
    console.log('I picked a filter:');
    // console.log(myModule.selectedFilter[0]);
    for (let u = 0; u < myModule.filters.length; u += 1) {
      console.log('inside this loop');
      console.log(myModule.filters[u].filterby);
      console.log(myModule.selectedFilter[s]);
      // myModule[myModule.filters[u].filterby] = false;
      if (myModule.filters[u].filterby === myModule.selectedFilter[s]) {
        console.log('I have a match');
        myModule[myModule.filters[u].filterby] = true;
      }
    }
  }
  console.log('these are the selected filters');
  console.log(myModule.selectedFilter);
  for (let a = 0; a < myModule.filters.length; a += 1) {
    if (myModule.selectedFilter.indexOf(myModule.filters[a].filterby) === -1) {
      myModule[myModule.filters[a].filterby] = false;
      myModule.filters[a].value = '';
    }
  }
};


exports.showSlides = function (idArray) {
  idArray.forEach((id) => {
    // let slides;
    const slides = document.getElementById(id);
    if (slides !== null) {
      $(`#${id} > div:first`)
        .hide()
        .next()
        .fadeIn(1500)
        .end()
        .appendTo(`#${id}`);
    }
  });
};

exports.startSlides = function (idArray1, errorMsg, idArray2) {
  const slideshowTimer = setInterval(() => {
    let foundElement = false;
    idArray1.forEach((id) => {
      const tempMS = document.getElementById(id);
      if (tempMS !== null && tempMS !== undefined) {
        tempMS.style.display = 'none';
      } else {
        foundElement = true;
      }
    });
    if (!(foundElement)) {
      console.log(errorMsg);
      return clearInterval(slideshowTimer);
    }
    return this.showSlides(idArray2);
  }, 5400);
};

exports.showCheckboxes = function (id, forceOpen) {
  let fo = false;
  if (forceOpen !== null && forceOpen !== undefined) {
    fo = forceOpen;
  }
  const checkboxes = document.getElementById(id);
  if (checkboxes.style.display === 'block' && !fo) {
    checkboxes.style.display = 'none';
    return false;
  }
  checkboxes.style.display = 'block';
  return true;
};
