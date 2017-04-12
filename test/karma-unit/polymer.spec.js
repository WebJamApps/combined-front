
describe('The Polymer module', () => {
  var xhr;
  
  beforeEach(() => {
    xhr = new XMLHttpRequest();
  });
  
  // it('Should load webcomponents-lite.js', () => {
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState === XMLHttpRequest.DONE) {
  //       expect(xhr.status).toBe(200);
  //     }
  //   };
  //   xhr.open('GET', 'http://localhost:9000/bower_components/webcomponentsjs/webcomponents-lite.js');
  //   xhr.send();
  // });
  
  it('Should load all the components in includes.html', () => {
    let components = [];
    it('Should load includes.html', () => {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          expect(xhr.status).toBe(200);
          
          // Parse the HTML
          let doc = document.implementation.createHTMLDocument('includes');
          doc.documentElement.innerHTML = xhr.responseText;
          let tags = doc.getElementsByTagName('link');
          for (j = 0; j < tags.length; j++) {
            components[i] = tags[i].getAttribute('href');
          }
        }
      };
      xhr.open('GET', 'http://localhost:9000/includes.html');
      xhr.send();
    });
    
    it('Should load all components in includes.html', () => {
      for (i = 0; i < components.length; i++) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            expect(xhr.status).toBe(200);
          }
        };
        xhr.open('GET', 'http://localhost:9000/' + components[i]);
        xhr.send();
      }
    });
  });
});
