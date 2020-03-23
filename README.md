# Cowndown timer codng challenge

## Bootstrapped

* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the [TypeScript](https://create-react-app.dev/docs/adding-typescript/) template.
* Use [PatternFly v4](https://www.patternfly.org/v4/) for
  [React](https://github.com/patternfly/patternfly-react), the first time. ;)
* Tests are based on the [testing-library](https://testing-library.com/) (with [react-testing-library](https://github.com/testing-library/react-testing-library) and [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library))

```
npx create-react-app countdown --use-npm --template typescript
cd countdown
npm install @patternfly/react-core @patternfly/react-table @patternfly/react-icons --save
npm install --save-dev @testing-library/react @testing-library/react-hooks
npm install --save-dev react-test-renderer@^16.13.0
```

## Setup

This project requires node with npm. To install the project dependencies please run `npm install`.

## Available Scripts

In the project directory, you can run `npm start` to start a local development server. After that open [localhost:3000](http://localhost:3000/).

To run the tests run `npm test` or `npm run coverage`. After the coverage run, you find the coverage in `coverage/lcov-report/index.html`.

Other available commands: `npm run build` and `npm run netlify`. You find the latest master version (incl. the coverage, build with the 2nd command) automatically on:

* [countdown-challenge.netlify.com](https://countdown-challenge.netlify.com/)
* [countdown-challenge.netlify.com/coverage/](https://countdown-challenge.netlify.com/coverage/index.html)

Netlify build status: [![Netlify Status](https://api.netlify.com/api/v1/badges/e272cdad-cc95-40c2-8f72-c7c69e4aff7e/deploy-status)](https://app.netlify.com/sites/countdown-challenge/deploys)

## Design

![Timeline concept](https://raw.githubusercontent.com/jerolimov/countdown/master/design/timeline.png)

![UI concept](https://raw.githubusercontent.com/jerolimov/countdown/master/design/ui.png)
