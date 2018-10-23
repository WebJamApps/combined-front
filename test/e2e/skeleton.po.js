export class PageObjectSkeleton {
  getCurrentPageTitle() {
    return browser.getTitle();
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


  async navigateTo(href) {
    const navigatingReady = browser.waitForRouterComplete();
    await element(by.css(`a[href="${href}"]`)).click();
    console.log('did I get here or fail before?')
    await this.sleep(1000);
    await navigatingReady;
  }
}
