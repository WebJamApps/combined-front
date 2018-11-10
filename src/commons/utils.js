const csvjson = require('csvjson');
const filesaver = require('file-saver');
const showSlides = require('./showSlides');

exports.fixDates = function fixDates(myevents) {
  for (let i = 0; i < myevents.length; i += 1) {
    const startDate = myevents[i].voStartDate;
    const endDate = myevents[i].voEndDate;
    if (startDate !== null && startDate.indexOf('T') !== -1) {
      myevents[i].voStartDate = startDate.substr(0, startDate.indexOf('T'));
    }
    if (endDate !== null && endDate.indexOf('T') !== -1) {
      myevents[i].voEndDate = endDate.substr(0, endDate.indexOf('T'));
    }
  }
  return myevents;
};

exports.formatDate = function formatDate(today) {
  const mm = today.getMonth() + 1; // getMonth() is zero-based
  const dd = today.getDate();
  today = [today.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('');
  return today;
};

exports.markPast = function markPast(myEvents, formatDate) {
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

exports.makeFilterDropdown = function makeFilterDropdown(filterName, model, attrib) {
  filterName.push('');
  for (const next of model) {
    const nextType = next[attrib];
    if (filterName.indexOf(nextType) === -1) {
      filterName.push(nextType);
    }
  }
};

exports.finishFiltering = function finishFiltering(myModule) {
  for (let s = 0; s < myModule.selectedFilter.length; s += 1) {
    for (let u = 0; u < myModule.filters.length; u += 1) {
      if (myModule.filters[u].filterby === myModule.selectedFilter[s]) {
        myModule[myModule.filters[u].filterby] = true;
      }
    }
  }
  for (let a = 0; a < myModule.filters.length; a += 1) {
    if (myModule.selectedFilter.indexOf(myModule.filters[a].filterby) === -1) {
      myModule[myModule.filters[a].filterby] = false;
      myModule.filters[a].value = '';
    }
  }
};

exports.filterSelected = function filterSelected(myModule) {
  if (myModule.selectedFilter.length === 0) {
    for (let i = 0; i < myModule.filters.length; i += 1) {
      myModule.filters[i].value = '';
      myModule[myModule.filters[i].filterby] = false;
    }
    return;
  }
  this.finishFiltering(myModule);
};

exports.startSlides = function startSlides(idArray1, errorMsg, idArray2, doc) {
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
      return clearInterval(slideshowTimer);
    }
    return showSlides.showSlides(idArray2, doc);
  }, 5400);
};

exports.showCheckboxes = function showCheckboxes(id, forceOpen) {
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

exports.nevermind = function nevermind(className) {
  const regform1 = document.getElementsByClassName(className);
  if (regform1[0] !== undefined) {
    regform1[0].style.display = 'none';
  }
};

exports.textFileValidate = function textFileValidate() {
  const nub = document.getElementById('deleteCreateButton');
  document.getElementsByClassName('errorMessage')[0].innerHTML = '';
  nub.style.display = 'none';
  let valid = false;
  for (let i = 0; i < CSVFilePath.files.length; i += 1) {
    const oInput = CSVFilePath.files[i];
    // the type is determined automatically during the creation of the Blob.
    // this value cannot be controlled by developer, hence cannot test it.
    /* istanbul ignore if */
    if (oInput.type === 'text/plain') {
      nub.style.display = 'block';
      valid = true;
    } else {
      document.getElementsByClassName('errorMessage')[0].innerHTML = `Sorry, ${oInput.type} is an invalid file type.`;
      valid = false;
    }
  }
  return valid;
};

exports.makeCSVfile = function makeCSVfile(fetchClient, route, fileName) {
  return fetchClient.fetch(route)
    .then(response => response.json())
    .then((data) => {
      const options = {
        delimiter: '\t',
        headers: 'key'
      };
      const myFile = csvjson.toCSV(data, options);
      const file = new File([myFile], fileName, {
        type: 'text/plain;charset=utf-8'
      });
      return filesaver.saveAs(file);
    });
};
