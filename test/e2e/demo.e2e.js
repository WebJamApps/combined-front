const config = require('../protractor.conf').config;

const PageObjectSkeleton = require('./skeleton.po');

describe('aurelia skeleton app', () => {
  // let poWelcome;
  let poSkeleton;

  beforeEach(async () => {
    poSkeleton = new PageObjectSkeleton();
    // poWelcome = new PageObjectWelcome();

    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);
    // browser.manage().window().setSize(new Dimension(1600,900));
  });

  it('should load the page and display the initial page title', async () => {
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Web Jam LLC');
  });

  // it('should display greeting', () => {
  //   expect(poWelcome.getGreeting()).toBe('Welcome to the Aurelia Navigation App!');
  // });

  // it('should automatically write down the fullname', () => {
  //   poWelcome.setFirstname('John');
  //   poWelcome.setLastname('Doe');
  //
  //   // For now there is a timing issue with the binding.
  //   // Until resolved we will use a short sleep to overcome the issue.
  //   browser.sleep(200);
  //   expect(poWelcome.getFullname()).toBe('JOHN DOE');
  // });
  //
  // it('should show alert message when clicking submit button', () => {
  //   expect(poWelcome.openAlertDialog()).toBe(true);
  // });

  it('should navigate to Music page', async () => {
    await poSkeleton.navigateTo('/music');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Music | Web Jam LLC');
  });

  // it('should navigate to OHAF page', async () => {
  //   await poSkeleton.navigateTo('/ohaf');
  //   await expect(poSkeleton.getCurrentPageTitle()).toBe('OHAF | Web Jam LLC');
  // });

  it('should navigate to SC2RS page', async () => {
    await poSkeleton.navigateTo('/sc2rs');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('SC2RS | Web Jam LLC');
  });

  // it('should navigate to Library page', async () => {
  //   await poSkeleton.navigateTo('/library');
  //   await expect(poSkeleton.getCurrentPageTitle()).toBe('Library | Web Jam LLC');
  // });

  it('should navigate to Login page', async () => {
    await poSkeleton.navigateTo('/login');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Login | Web Jam LLC');
  });
});
