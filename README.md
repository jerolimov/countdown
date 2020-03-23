# Countdown coding challenge

## Bootstrapped

* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and the [TypeScript](https://create-react-app.dev/docs/adding-typescript/) template.
* It uses [PatternFly v4](https://www.patternfly.org/v4/) for
  [React](https://github.com/patternfly/patternfly-react), for me it was the first time. ;)
* Tests are based on the [testing-library](https://testing-library.com/) (with [react-testing-library](https://github.com/testing-library/react-testing-library) and [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library))
* Tests run automatically on [GitHub actions](https://github.com/jerolimov/countdown/actions)
  and on netlify (incl. [code coverage](https://countdown-challenge.netlify.com/coverage/index.html))
* Design documents / mockups created with [excalidraw.com](https://excalidraw.com/)

Bootstrapped with this commands:

```
npx create-react-app countdown --use-npm --template typescript
cd countdown
npm install @patternfly/react-core @patternfly/react-table @patternfly/react-icons --save
npm install --save-dev @testing-library/react @testing-library/react-hooks
npm install --save-dev react-test-renderer@^16.13.0
```

## Checkout and local setup (an online version is available below)

This project requires node with npm. To clone and install the project dependencies please run the following commands:

```
git clone https://github.com/jerolimov/countdown.git
cd countdown
npm install
```

## Available npm commands

In the project directory, you can run `npm start` to start a local development server. After that open [http://localhost:3000/](http://localhost:3000/).

To run the tests run `npm test` or `npm run coverage`. After the coverage run, you find the coverage in `coverage/lcov-report/index.html`.

Other available commands: `npm run build` and `npm run netlify` (see next chapter).

## Online version

You find the latest master version (incl. the test coverage) automatically on:

* [https://countdown-challenge.netlify.com/](https://countdown-challenge.netlify.com/)
* [https://countdown-challenge.netlify.com/coverage/](https://countdown-challenge.netlify.com/coverage/index.html)

Netlify build status: [![Netlify Status](https://api.netlify.com/api/v1/badges/e272cdad-cc95-40c2-8f72-c7c69e4aff7e/deploy-status)](https://app.netlify.com/sites/countdown-challenge/deploys)

## Design

### Timeline issue visualization

The used code architecture was based on requirement that the state of the countdown app should be re-stored in the browser. I used the localStorage for this.

To "simplify" date calculations, the internal used state system uses Date instances for the moments when the timer was `started` and `paused`. When the timer was `resumed` an internal countdown (`restTimeInMs`) was reduced. (restTimeInMs -= paused - resumed)

The "Laps" was saved as an array of Lap objects which contains the timestamp when a lap was created and the time between the last lap and the current lap. (Or the start if no lap was created before.) This enables us to remove a lap at any time.

![Timeline concept](https://raw.githubusercontent.com/jerolimov/countdown/master/design/timeline.png)

### UI concept / idea

The idea was to create an UI based on PatternFly which has in general two "screens":

The first shows the input for an countdown input with fields for days, hours, minutes and seconds. The input fields should automatically jump to the next field after the user entered two digits.

After starting the timer, the user has the option to pause/resume or stop the countdown. It should be also possible to create a lap and undo this. This is possible with two buttons and with the space/backspace keys as well.

![UI concept](https://raw.githubusercontent.com/jerolimov/countdown/master/design/ui.png)
