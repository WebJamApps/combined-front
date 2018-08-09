import { HttpClient } from 'aurelia-fetch-client';

describe('The Polymer module', () => {
  let http;

  beforeEach(() => {
    http = new HttpClient();
    http.configure((config) => {
      config.withBaseUrl(`http://localhost:${process.env.PORT}/`);
    });
  });

  it('Should load includes.html', () => {
    http.fetch('includes.html')
      .then(response => response.json())
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });

  it('Should load webcomponents.min.js', () => {
    http.fetch('webcomponents.min.js')
      .then(response => response.json())
      .then((data) => {
        expect(data.status).toBe(200);
      });
  });
});
