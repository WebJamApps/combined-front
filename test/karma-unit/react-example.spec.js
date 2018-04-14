import {ReactExample} from '../../src/react-example';

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

describe('++ React example', () => {
  let reactExample;

  beforeEach(() => {
    reactExample = new ReactExample();
    document.body.innerHTML = '<div class="here"><div><h1>Hello World</h1></div></div>';
  });

  it('should have the react element inner', testAsync(async function(){
    await reactExample.attached();
    expect(reactExample.reactElementInner).toBe('<h1>Hello World</h1>');
  }));
});
