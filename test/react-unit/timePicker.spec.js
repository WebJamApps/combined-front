
import {TimePicker} from '../../src/components/time-picker';

describe('++TimePicker tests', () => {
  let tp;
  let data = {
    'voName': 'Bogdan Yel',
    'voCharityId': '1894724ghjdsfhkjguwr3452352523yr',
    'voNumPeopleNeeded': 1,
    'voDescription': '',
    'voWorkTypes': [],
    'voTalentTypes': [],
    'voWorkTypeOther': '',
    'voTalentTypeOther': '',
    'voStartDate': true,
    'voStartTime': true,
    'voEndDate': true,
    'voEndTime': true,
    'voContactName': 'Bogdan Yelovich',
    'voContactEmail': 'bd.yel@bog.co',
    'voContactPhone': '',
    'voState': true,
    'voCity': true,
    'voStreet': true,
    'voZipCode': true
  };

  beforeEach(() => {
    tp = new TimePicker();
    tp.data = data;
  });

  it('should update time', (done) => {
    document.body.innerHTML = '<div id="scheduleEvent"></div>';
    tp.type = 'start';
    tp.updateTime(new Date());
    tp.type = 'end';
    tp.updateTime(new Date());
    done();
  });

  it('should bind element', (done) => {
    document.body.innerHTML = '<div id="renderer"></div>';
    tp.element = document.getElementById('renderer');
    tp.bind();
    done();
  });
});
