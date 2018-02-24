import {UserUtil} from '../../src/userutil';

let uu = new UserUtil();

describe('the User Util Module', () => {
  it('attaches', (done) => {
    document.body.innerHTML = '<div><div class="home"></div></div>';
    uu.attached();
    expect(document.getElementsByClassName('home')[0].innerHTML).not.toBe('');
    done();
  });
});
