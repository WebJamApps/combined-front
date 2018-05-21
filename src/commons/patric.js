exports.showHideElements2 = function (appName, objofElements) {
  const objKeys = Object.keys(objofElements);
  for (const i of objKeys) {
    for (const j of i) {
      document.getElementsByClassName(j)[0].style.display = 'none';
      if ((appName === i) || (i !== 'PATRIC' && appName !== 'PATRIC')) {
        document.getElementsByClassName(j)[0].style.display = 'block';
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
