exports.showHideElements2 = function (appName, objofElements) {
  const objKeys = Object.keys(objofElements);
  let element;
  for (let i = 0; i < objKeys.length; i++) {
    for (let j = 0; j < objofElements[objKeys[i]].length; j++) {
      element = objofElements[objKeys[i]][j];
      document.getElementsByClassName(element)[0].style.display = 'none';
      if ((appName === objKeys[i]) || (objKeys[i] !== 'PATRIC' && appName !== 'PATRIC')) {
        document.getElementsByClassName(element)[0].style.display = 'block';
      }
    }
  }
};

exports.nevermind = function (className) {
  const regform1 = document.getElementsByClassName(className);
  if (regform1[0] !== undefined) {
    regform1[0].style.display = 'none';
  }
};
