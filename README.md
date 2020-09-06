# Agile Avatars


WORK IN PROGRESS.

Source code for [agileavatars.com](https://agileavatars.com). An experiment in frameworkless/vanilla JavaScript.

![Build](https://github.com/mattriley/agileavatars/workflows/Build/badge.svg)
[![codecov](https://codecov.io/gh/mattriley/agileavatars/branch/master/graph/badge.svg)](https://codecov.io/gh/mattriley/agileavatars)
![Status](https://img.shields.io/uptimerobot/status/m783034155-295e5fbc9fd4a0e3a54363a5)
![30 days](https://img.shields.io/uptimerobot/ratio/m783034155-295e5fbc9fd4a0e3a54363a5)

> Agile Avatars makes it quick and easy to know who's working on what with great looking avatars for your agile board. No more fiddling with Word or Google Docs making sure everything aligns just right. Simply drag and drop your images, make some adjustments, print, and laminate!

This is a hobby project I decided to double as an experiment in developing a web application in JavaScript without the aid of a framework like React or Angular. Such an approach is often referred to as frameworkless, or vanilla JavaScript.

DISCLAIMER: Some of the approaches used are intentionally unconventional. Any attempt to emulate these approaches should be done with the unique needs and circumstances of your endeavour taken into consideration.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

- [Getting started](#getting-started)
- [Summary of technical constraints](#summary-of-technical-constraints)
- [Architecture](#architecture)
  - [Architectural components](#architectural-components)
- [State management](#state-management)
- [Constraints](#constraints)
  - [System quality attributes](#system-quality-attributes)
  - [Design decisions](#design-decisions)
- [Dependencies](#dependencies)
  - [Production dependencies](#production-dependencies)
  - [Development dependencies](#development-dependencies)
- [Conventions](#conventions)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Getting started

__Prerequisites__
- Install Node 14.4.0 or install [nvm](https://github.com/nvm-sh/nvm) and run `nvm install`
- Install dependencies: `npm install`

__Tasks__
- Run the tests: `./task test`
- Start local dev server: `./task start`
- See all available dev tasks: `ls ./tasks`

__iTerm2 automated window arrangement (macOS only)__
- Install iTermocil: `./task itermocil-install`
- Launch window arrangement: `./task itermocil`

Lanches a new iTerm2 tab with 3 panes: empty command prompt, local dev server, index.js file generator.

# Summary of technical constraints

- No languages that compile to JavaScript; No TypeScript. 
  - [You Might Not Need TypeScript (or Static Types) - Eric Elliott](https://medium.com/javascript-scene/you-might-not-need-typescript-or-static-types-aa7cb670a77b)
  - [The Shocking Secret About Static Types](https://medium.com/javascript-scene/the-shocking-secret-about-static-types-514d39bf30a3)
- No frameworks, view libraries, state management libraries; No Angular, React, Redux.
- No globals. Including tests. Access to `window` strictly controlled.
- No classes. Prefer partial application.
  - [Curry and Function Composition - Eric Elliott](https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983)
- No `..` in require paths in `src` and `tests`. Minimise `..` in paths in general.
- Prefer dependencies that do one thing and do it well.
  - [Unix philosophy - Wikipedia](https://en.wikipedia.org/wiki/Unix_philosophy)
- Dependencies are liabilities. Exercise due diligence.
  - [Dependency Management Guidelines For Rails Teams - Brandon Dees](https://blog.engineyard.com/dependency-management-guidelines-for-rails-teams)
  - [3 pitfalls of relying on third-party code libraries - Andy Henson](https://www.foxsoft.co.uk/3-pitfalls-of-relying-on-third-party-code-libraries/)
- Layered architecture for separation of concerns.
  - [PresentationDomainDataLayering - Martin Fowler](https://martinfowler.com/bliki/PresentationDomainDataLayering.html)
- Service functions are imperative shells.
  - [Functional Core, Imperative Shell - Gary Bernhardt](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell)
- Module composition confined to a composition root.
  - [Composition Root - Mark Seemann](https://blog.ploeh.dk/2011/07/28/CompositionRoot/)
- Autogenerated `index.js` to aggregate siblings into an object graph. 
- Unit test suite optimised for speed. Max 10 seconds. Currently < 2 seconds.
  - [TDD test suites should run in 10 seconds or less - Mark Seemann](https://blog.ploeh.dk/2012/05/24/TDDtestsuitesshouldrunin10secondsorless/)

# Architecture

![Architecture](docs/readme/architecture.svg)

Omitted for brievity:
- __Lib__: All depend on Lib except Config and IO.
- __Config__: All depend on Config except Elements and Lib.

A familiar presentation/domain/data __layered architecture__ has been used to manage __separation of concerns__. This is a common approach to modularise backend applications and therefore I hypothesise this design will be more approachable for backend developers.

## Architectural components

### Components

A plain object graph containing only _component builder functions_.

A __component builder function__ returns an object deriving [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) using closures to react to both user interaction and state changes (via subscriptions), may self-mutate, and interact with services.

<details open>
<summary>src/components/tag-list/tag/components/tag-name.js</summary>

```js
module.exports = ({ elements, services, subscriptions }) => tagInstanceId => {

    const $tagName = elements.editableSpan('tag-name')
        .addEventListener('change', () => {
            services.tags.changeTagInstanceName(tagInstanceId, $tagName.textContent);
        });

    subscriptions.tagInstances.onChange(tagInstanceId, 'tagName', tagName => {
        $tagName.textContent = tagName;
    });

    return $tagName;

};
```
</details>

Because component builder functions simply return native HTML elements, they can easily be appended to create component hierarchies.

<details open>
<summary>src/components/header/header.js</summary>

```js
module.exports = ({ el, header }) => () => {

    return el('header').append(
        header.titleBar(), 
        header.navBar()
    );
    
};
```
</details>

__Why not decouple components from services?__

TODO: Consider splitting and/or moving this section.

Many patterns and frameworks exist to decouple views from effects. Well known examples include MVC, Flux, pub/sub (and their derivatives). Every pattern and framework inherently comes with trade-offs, and patterns inevitably lead to frameworks. 

From a technical perspective these patterns and frameworks can introduce a fair degree of boilerplate and indirection. Redux is extremely popular, yet many developers complain about the learning curve, boilerplate and needless complexity, and yearn for a simpler solution.

There are also human elements to consider:
- Initial learning curve to productivity.
- Subsequent Learning curve to mastery.
- Encountering numerous variations of these patterns and frameworks reducing the time available to achieve mastery of any of them.
- Not knowing what good looks like and whether it's helping or hindering compared to other options.
- Not actually analysing the trade-offs and going with popular choice.

Bucking the trend as part of the experiment, I am allowing components to also be controllers in that they can effect change by calling on services directly. In order to limit complexity, components are kept small, typically encapsulating one or a small number of interactions.

### Elements

A plain object graph containing only _element builder functions_.

An __element builder function__ returns an object deriving [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) using closures to react to user interaction, and may self-mutate.

Elements are 'fundamental' components. Unlike components, they cannot react to state changes or interact with services. For this reason, elements tend to be lower level, generic, and reusable.

<details open>
<summary>src/elements/editable-span.js</summary>

```js
module.exports = ({ window, elements }) => className => {

    const dispatchChange = () => $span.dispatchEvent(new window.Event('change'));

    const $span = elements.el('span', className)
        .addEventListener('blur', () => {
            dispatchChange();
        })
        .addEventListener('keydown', e => {            
            if (e.code === 'Enter') {
                e.preventDefault();
                dispatchChange();
            }
        });
    
    $span.setAttribute('contenteditable', true);

    return $span;
};
```
</details>

### Services

A plain object graph containing only _service functions_.

A __service function__ orchestrates domain logic and IO including state changes.

Inspired by [Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell), __services__ comprise the 'imperative shell'.

<details open>
<summary>src/services/tags/change-tag-instance-name.js</summary>

```js
module.exports = ({ core, services, stores }) => (tagInstanceId, expression) => {

    const { tagId } = services.tags.getTagInstance(tagInstanceId);
    const { tagName, roleName } = core.tags.parseTagExpression(expression);

    stores.tags.setState(tagId, { tagName });

    if (roleName) {
        const roleId = services.roles.findOrInsertRoleWithName(roleName);
        stores.tags.setState(tagId, { roleId });
    }
    
};
```
</details>

### Core

A plain object graph containing only _pure functions_.

From [Wikipedia](https://en.wikipedia.org/wiki/Pure_function):
> In computer programming, a __pure function__ is a function that has the following properties:
> 1. Its return value is the same for the same arguments (no variation with local static variables, non-local variables, mutable reference arguments or input streams from I/O devices).
> 2. Its evaluation has no side effects (no mutation of local static variables, non-local variables, mutable reference arguments or I/O streams).

Inspired by [Functional Core, Imperative Shell](https://www.destroyallsoftware.com/screencasts/catalog/functional-core-imperative-shell), __core__ comprises the 'functional core'.

<details open>
<summary>src/core/tags/parse-tag-expression.js</summary>

```js
module.exports = () => expression => {

    const [tagName, roleName] = expression.split('+').map(s => s.trim());        
    return { tagName, roleName };

};
```
</details>

### IO

A plain object graph containing only functions that that depend on or act on the environment. 

<details open>
<summary>src/io/io.js</summary>

```js
module.exports = ({ window }) => {

    return {
        random: window.Math.random,
        fetch: window.fetch.bind(window),
        date: () => new window.Date(),
        createFileReader: () => new window.FileReader()
    };

};
```
</details>

### Subscriptions

A plain object graph containing only _subscription functions_.

A __subscription function__ enables a listener to be notified of state changes.

### Stores

A plain object graph containing only instances of _state stores_.

A __state store__ encapsulates state mutations and notifications.

### Lib

A plain object graph containing only utility functions without collaborators.

### Config

A plain object graph containing only primitive data types.

# State management

<details >
<summary>src/lib/storage/state-store.js</summary>

```js
const EventEmitter = require('events');

module.exports = localState => {
    let nextId = 1;
    const funcIndex = {};
    const collectionEmitter = new EventEmitter();

    const manage = id => funcIndex[id] ?? { getState: () => null };
    const getArray = () => Object.values(localState);
    const getState = id => manage(id).getState();
    const setState = (id, changes) => manage(id).setState(changes);

    const onChange = (id, key, listener) => manage(id).subscriptions.onChange(key, listener);
    const onChangeAny = (key, listener) => collectionEmitter.on(key, listener);
    const onInsert = listener => collectionEmitter.on('insert', listener);
    const onFirstInsert = listener => collectionEmitter.once('firstInsert', listener);
    const onBeforeRemove = listener => collectionEmitter.on('beforeRemove', listener);
    const subscriptions = { onChange, onChangeAny, onInsert, onFirstInsert, onBeforeRemove };

    const insert = (data, callback) => {
        const id = nextId++;
        const state = { id, ...data };
        const itemEmitter = new EventEmitter();

        const getState = () => ({ ...state });

        const setState = changes => {
            Object.entries(changes).forEach(([key, val]) => {
                if (state[key] === val) return;
                state[key] = val;
                const emit = emitter => emitter.emit(key, state[key], state);
                [itemEmitter, collectionEmitter].forEach(emit);
            });
        };

        const onChange = (key, listener) => {
            itemEmitter.on(key, listener);
            const invoke = () => listener(state[key], state);
            invoke();
        };

        const subscriptions = { onChange };
        localState[id] = state;  
        funcIndex[id] = { getState, setState, subscriptions };

        if (callback) callback(id);
        collectionEmitter.emit('firstInsert', id);
        collectionEmitter.emit('insert', id);
        return id;
    };

    const remove = id => {
        collectionEmitter.emit('beforeRemove', id);
        delete funcIndex[id];
        delete localState[id];
    };

    return { manage, insert, remove, getArray, getState, setState, subscriptions };

};
```
</details>

# Constraints

## System quality attributes

### Learnability

- Prioritise for beginner-friendliness, or [Shoshin](https://en.wikipedia.org/wiki/Shoshin), meaning "beginner's mind".
- Minimise the need for prerequisite knowledge.
- Minimise the number of elements to learn beyond native JavaScript and basic design patterns.
- Minimise the use of obscure language features.
- When multiple options exist, use the simplest tool for the job.

### Maintainability

- Minimise dependencies to reduce security concerns and upgrade cycles.
- Clean code. [Here's a good summary](https://gist.github.com/wojteklu/73c6914cc446146b8b533c0988cf8d29).
- Adopt functional programming techniques with a low learninig curve, supported by native JavaScript.

## Design decisions

### Autogenerated index.js files

Constraints:
- `index.js` files must load and export sibling files and directories.
- Non-`index.js` files must only load directories (i.e. `index.js` files).

Implications:
- Files are loaded only once each.
- Results are shared by "passing down" using function arguments.
- Non-`index.js` files have very few import/require statements.
- `index.js` files have a single responsibility.
- `index.js` files don't contain logic.
- `index.js` files could be generated.
- Increases likelihood that any logic is placed in appropriately named file, which improves searchability.
- Increase the likelihood that dependencies will be structured in a logical and predictable manner.

Avoids:
- Source files starting with potentially large blocks of import/require statements.
- Loading the same file multiple times with a slighly different relative path.
- Coupling to file paths in general.

### Minimise test doubles and avoid mocking libraries

Eric Elliott's [Mocking is a code smell](https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a) says it all:

> Mocking is required when our decomposition strategy has failed.

Encourages:
- Loose coupling.
- Test doubles without the aid of a library.



# Dependencies

Constraints:

- Not driven by hype or popularity
- No alternative built into JavaScript exists
- Non-trivial to implement with vanilla JavaScript
- No alternative built into Node.js exists
- No alternative that more closely matches the need exists
- No alternative with fewer dependencies exists
- Low learning curve
- Low maintenance
- Low likelihood of changing in a material way
- Low impact of material change

## Production dependencies

### ❖ @sentry/browser

> Official Sentry SDK for browsers

- Homepage: https://github.com/getsentry/sentry-javascript/tree/master/packages/browser
- __4__ dependencies :white_check_mark:

#### Used for

Integration with [Sentry](https://sentry.io/) for monitoring and alerting.




### ❖ blueimp-md5

> JavaScript MD5 implementation. Compatible with server-side environments like Node.js, module loaders like RequireJS, Browserify or webpack and all web browsers.

- Homepage: https://github.com/blueimp/JavaScript-MD5
- __0__ dependencies :boom:

#### Used for

Hashing of email addresses for use with the Gravatar service.

#### Comments

- __No alternative built into JavaScript exists__\
JavaScript does not feature a built-in MD5 implementation.

- __No alternative built into Node.js exists__\
The crypto module supports MD5. It does not seem possible to extract individual algorithms from crypto. The consequence is a minified bundle size of 431.78 KB compared with 4.86 KB for blueimp-md5 which is a significant difference.

- __No alternative that more closely matches the need exists__\
According to [this issue](https://github.com/blueimp/JavaScript-MD5/issues/26), the original use case was to hash email addresses for Gravatar.



### ❖ module-composer

> Composes 'modules' enabling coarse-grained module-level depenency injection

- Homepage: https://github.com/mattriley/node-module-composer
- __1__ dependency :white_check_mark:

#### Used for

Module composition / dependency injection.

#### Comments

- __No alternative that more closely matches the need exists__\
This library was extracted from Agile Avatars.



### ❖ vanilla-picker

> A simple, easy to use vanilla JS color picker with alpha selection.

- Homepage: https://vanilla-picker.js.org
- __1__ dependency :white_check_mark:

#### Used for

Presenting a color picker to change the color of a role.





## Development dependencies

### ❖ c8

> output coverage reports using Node.js' built in coverage

- Homepage: https://github.com/bcoe/c8#readme
- __13__ dependencies :warning:

#### Used for

Code coverage



#### Alternatives considered

- __nyc__\
nyc was originally used for code coverage and was fine however c8 was chosen for leveraging [native coverage](https://nodejs.org/dist/latest-v10.x/docs/api/cli.html#cli_node_v8_coverage_dir) in recent versions of Node and V8

### ❖ doctoc

> Generates TOC for markdown files of local git repo.

- Homepage: https://github.com/thlorenz/doctoc#readme
- __6__ dependencies :white_check_mark:

#### Used for

Generating README table of contents.




### ❖ ejs

> Embedded JavaScript templates

- Homepage: https://github.com/mde/ejs
- __1__ dependency :white_check_mark:

#### Used for

Generating README from a template.




### ❖ eslint

> An AST-based pattern checker for JavaScript.

- Homepage: https://eslint.org
- __37__ dependencies :warning:

#### Used for

Linting and code formatting.



#### Alternatives considered

- __prettier__\
Prettier was originally used for code formatting but was dropped due to limited configurability.

### ❖ husky

> Prevents bad commit or push (git hooks, pre-commit/precommit, pre-push/prepush, post-merge/postmerge and all that stuff...)

- Homepage: https://github.com/typicode/husky#readme
- __10__ dependencies :warning:

#### Used for

Running pre-commit validation scripts.




### ❖ jsdom

> A JavaScript implementation of many web standards

- Homepage: https://github.com/jsdom/jsdom#readme
- __26__ dependencies :warning:

#### Used for

Emulating a web browser so tests can be run with Node.js for speed.

#### Comments

- __Low impact of material change__\
There does not seem to be any viable replacement for JSDOM. The fallback would be to run the tests in a browser. The cost is estimated to be low.



### ❖ module-indexgen

> Generates index.js files

- Homepage: https://github.com/mattriley/node-module-indexgen
- __5__ dependencies :white_check_mark:

#### Used for

Generating index.js files.

#### Comments

- __No alternative that more closely matches the need exists__\
This library was extracted from Agile Avatars.



### ❖ parcel-bundler

> Blazing fast, zero configuration web application bundler

- Homepage: https://github.com/parcel-bundler/parcel#readme
- __59__ dependencies :warning:

#### Used for

Bundling the application.

#### Comments

- __No alternative with fewer dependencies exists__\
Parcel has many dependencies. An exception is made for ease of use.

- __Low learning curve__\
Designed to be easier to use than webpack.



### ❖ tap-mocha-reporter

> Format a TAP stream using Mocha's set of reporters

- Homepage: https://github.com/isaacs/tap-mocha-reporter
- __8__ dependencies :white_check_mark:

#### Used for

Formatting test output. Supports indented TAP output.




### ❖ zora

> tap test harness for nodejs and browsers

- Homepage: https://github.com/lorenzofox3/zora#readme
- __0__ dependencies :boom:

#### Used for

Lightweight test harness optimised for speed and simplicity.



#### Alternatives considered

- __tape__\
tape was originally used however zora is newer and has some advantages over tape.


# Conventions

### Prefix $ to variables storing HTML element and $$ for collections of HTML elements

I generally prefer to avoid variable prefixes but I've found these prefixes help in a couple of ways:

1. Improves visual scanning of code making it faster to interpret.
2. Avoids naming conflicts, e.g. `$tagName.textContext = tagName;`

### Clarifying comments as footnotes

Such comments are secondary to the code and so follow the code rather than preceed it.

<details open>
<summary>src/components/tag-list/tag/components/tag-image.js</summary>

```js
module.exports = ({ el }) => () => {

    return el('div', 'tag-image');

};

/* FOOTNOTES

Actual image is rendered using CSS background-image as a performance optimisation.

*/
```
</details>

### Functional programming

- Prefer `const` over `let`, and avoid `var`.
- Prefer higher-order functions such as `filter`, `map`, `reduce`, over imperative looping statements.
- Prefer currying dependencies over constructors (classes), e.g. `({ dep1, dep2 }) => ({ arg1, arg2 }) => { ... }`
