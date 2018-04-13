// this are unit tests for the AppState

import {ReactExample} from '../../src/react-example';

describe('++ React example', () => {
  let reactExample;

  beforeEach(() => {
    reactExample = new ReactExample();
  });

  it('should just log react example', () => {
    console.log(reactExample);
  });
});
