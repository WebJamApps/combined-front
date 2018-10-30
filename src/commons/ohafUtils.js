exports.doubleCheckSignups = async function doubleCheckSignups(thisevent, module, doc) {
  // get this event, check if start date is in past, check if max signups are already reached
  const errorP = doc.getElementsByClassName('signupErrors')[0];
  let res, data;
  module.canSignup = true;
  try {
    res = await module.app.httpClient.fetch(`/volopp/get/${thisevent._id}`);
    data = await res.json();
  } catch (e) {
    module.canSignup = false;
    return Promise.reject(e);
  }
  if (data.voStartDate) {
    let today = new Date(),
      testDate = data.voStartDate.replace('-', '');
    today = module.commonUtils.formatDate(today);
    testDate = testDate.replace('-', '');
    if (testDate < today) {
      errorP.innerHTML = 'this event has already started';
      module.canSignup = false;
      thisevent.past = true;
    }
  }
  if (data.voPeopleScheduled) {
    if (data.voPeopleScheduled.length >= data.voNumPeopleNeeded) {
      errorP.innerHTML = 'this event has already reached max volunteers needed';
      module.canSignup = false;
      thisevent.maxReached = true;
    }
  }
  return Promise.resolve(module.canSignup);
};
