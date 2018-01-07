# combined-front
[![CircleCI](https://circleci.com/gh/WebJamApps/combined-front.svg?style=svg)](https://circleci.com/gh/WebJamApps/combined-front)
[![Test Coverage](https://codeclimate.com/github/WebJamApps/combined-front/badges/coverage.svg)](https://codeclimate.com/github/WebJamApps/combined-front/coverage)
[![Issue Count](https://codeclimate.com/github/WebJamApps/combined-front/badges/issue_count.svg)](https://codeclimate.com/github/WebJamApps/combined-front/issues)
[![Maintainability](https://api.codeclimate.com/v1/badges/cd44da430d179188ea8e/maintainability)](https://codeclimate.com/github/WebJamApps/combined-front/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/webjamapps/combined-front/badge.svg)](https://snyk.io/test/github/webjamapps/combined-front)

This is the front end for the following apps:
<ui>
<li><a href="http://www.ourhandsandfeet.org">ourhandsandfeet.org</a></li>
<li><a href="https://www.web-jam.com">Web Jam LLC</a></li>
<li><a href="http://www.joshandmariamusic.com">joshandmariamusic.com</a></li>
<li><a href="https://www.web-jam.com/library">Web Jam Library</a></li>
</ul>

<br> Here are the steps to get the development version running. First, read our <a href="https://docs.google.com/document/d/1_QDDbqmBrJuGqBoib59fmgYtls03dAXXuLqRR5roPO4/edit">Getting Started for Developers</a> gdoc to make sure you have all of the necessary prerequisites installed, including the correct version of NodeJS that matches the version specified in our package.json.

Clone this repository into a directory of your choice from the terminal using <b>git clone [url of this repository]</b><br>
Install and use the version of nodejs currently listing in our package.json<br>
Create a <b>.env</b> file at the project root and request the contents from <b>@JoshuaVSherman</b>.<br>You will not be able to build without this file, so there is no need to try installing anything until you have this in place.<br>
From the same directory, run
<br><b>npm install -g yarn</b>
<br><b>yarn install</b><br>

Run <b>npm start</b> to start the webpack development server.<br>
Install the <b>Aurelia Inspector</b> Chrome extension to allow debugging of the font end code.

Now, open your browser and go to <b>localhost:9000</b>

The homepage should display correctly.

<b><i>Note</b></i>: you will not be able to use the "Login" feature of the website unless you also run the back end server.

When working on unit tests, use the command <b>npm run test:debug</b><br>
This will run the tests in continuous mode and launch a Chrome browser with Karma debugging enabled.

To get the latest version of code, <b>git pull origin dev</b> and then switch to your own branch.

You will no be able to push directly to the dev branch, rather we would appreciate if you pushed to your own branch and then submit a pull request to the <b>dev</b> branch.

Since we are running some alpha and beta node packages, there will be times when the developer will need to reinstall all dependencies.
It may be necessary to delete the entire Node_Modules folder and then clean the cache by running this script:<br>
<b>npm run cleaninstall</b><br>

<br>
<a href="https://www.browserstack.com"><img src="https://d3but80xmlhqzj.cloudfront.net/production/images/static/header/header-logo.svg" alt="BrowserStack" width="200px"/></a>
<br>We are using BrowserStack to test compatibility with Safari and IE 11, and we thank them for supporting open-source projects.
