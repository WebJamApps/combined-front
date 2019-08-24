import { PageObjectSkeleton } from './skeleton.po';

const config = require('../protractor.conf').config;


describe('combined-front', () => {
  let poSkeleton;

  beforeEach(async () => {
    poSkeleton = new PageObjectSkeleton();
    await browser.loadAndWaitForAureliaPage(`http://localhost:${config.port}`);
    await browser.driver.manage().window().maximize();
    await poSkeleton.sleep(1000);
  });

  it('should load the page and display the initial page title', async () => {
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Web Jam LLC');
  });

  it('should navigate to OHAF page', async () => {
    await poSkeleton.navigateTo('/ohaf');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('OHAF | Web Jam LLC');
  });

  it('should navigate to Bookshelf page', async () => {
    await poSkeleton.navigateTo('/ohaf/bookshelf');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Library | Web Jam LLC');
  });

  it('should navigate to Login page', async () => {
    await poSkeleton.navigateTo('/login');
    await expect(poSkeleton.getCurrentPageTitle()).toBe('Login | Web Jam LLC');
  });
});
