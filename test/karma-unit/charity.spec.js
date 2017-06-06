import {Charity} from '../../src/dashboard-child-routes/charity';
import {App} from '../../src/app';
import {AuthStub, HttpMock, RouterStub, AppStateStub} from './commons';

describe('the Charity Module', () => {
  let charity;
  let app;
  let auth;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub:"aowifjawifhiawofjo"});
    app = new App(auth, new HttpMock());
    app.activate();
    charity = new Charity(app);
  });

  it('activates', (done) => {
    charity.activate();
    done();
  });

  it('checkboxes expanded', (done)=>{
    document.body.innerHTML = '  <iron-dropdown id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></iron-dropdown>';
    charity.expanded = true;
    charity.showCheckboxes('types');
    expect(charity.expanded).toBe(false);
    done();
  });

  it('checkboxes closed', (done)=>{
    document.body.innerHTML = '  <iron-dropdown id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></iron-dropdown>';
    charity.expanded = false;
    charity.showCheckboxes('types');
    expect(charity.expanded).toBe(true);
    done();
  });

  it("type picked length = 0", (done)=>{
    charity.selectedType = [];
    charity.typePicked();
    expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it("type picked length > 0", (done)=>{
    let testArray = ["Charity 1", "Charity 2"]
    charity.selectedType = testArray;
    charity.typePicked();
    expect(charity.newCharity.charityType).toBe(testArray);
    done();
  });

  it("new charity created", (done)=>{
    charity.app.appState = new AppStateStub();
    charity.activate().then(()=>{
      charity.user.name = "Test Name";
      charity.newCharity.charityState = 1;
      charity.createCharity();
      expect(charity.newCharity.charityManagers[0]).toBe("Test Name");
      expect(charity.newCharity.charityState).toBe("Alabama");
      done();
    });

  });
});
