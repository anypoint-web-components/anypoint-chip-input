[![Published on NPM](https://img.shields.io/npm/v/@anypoint-web-components/anypoint-chip-input.svg)](https://www.npmjs.com/package/@anypoint-web-components/anypoint-chip-input)

[![Build Status](https://travis-ci.org/anypoint-web-components/anypoint-chip-input.svg?branch=stage)](https://travis-ci.org/anypoint-web-components/anypoint-chip-input)

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/anypoint-web-components/anypoint-chip-input)

# anypoint-chip-input

A material design input with chips styled for Anypoint platform.

This element extends AnypointInput class.

Chips are compact elements that represent an input, attribute, or action.


## Usage

### Installation
```
npm install --save @anypoint-web-components/anypoint-chip-input
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/anypoint-chip-input/anypoint-chip-input.js';
    </script>
  </head>
  <body>
    <anypoint-chip-input></anypoint-chip-input>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/anypoint-chip-input/anypoint-chip-input.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <anypoint-chip-input></anypoint-chip-input>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

### Input value

The `value` property represents current user input. The input is cleared each time a suggestion is accepted.

Chips value can be read from `chipsValue` property. It also accepts previous values as long as suggestions (`source` property) is set.

You can directly manipulate chips data model by accessing `chips` property. Note that the element does not observe deep changes in the array. Re-assign the array when changing the model. lit-html handles template rendering efficiently in this case.

### Predefined suggestions

The input accepts chips value via `chips` property. It is an array of values to render when the element is initialized or at runtime.

```javascript
const chips = [
  {
    label: 'Chip #1'
  },
  {
    label: 'Chip #2', removable: true
  },
  {
    label: 'Chip #3', icon: 'maps:directions-bike'
  }
];
html`<anypoint-chip-input .chips="${chips}">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

Chips are required to have a `label` property that is used to render the value.

A chip can have a `removable` property that allows the user to remove the chip from the input.

An `icon` property allows to render a chip with an icon.


### Chip suggestions with icons

Chip input accepts `source` array with a list of suggestions to render in a dropdown on user input. It can be list of strings or a list of maps with `value` property and optionally `icon` property.

#### Simple suggestions

```javascript
const source = [
  'Apple', 'Apricot', 'Avocado', ...
];

html`<anypoint-chip-input .source="${source}">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

#### Icons suggestions

The icon is rendered in a chip only.

```javascript
const source = [
  {
    value: 'Biking',
    icon: 'maps:directions-bike'
  }, {
    value: 'Boat trip',
    icon: 'maps:directions-boat'
  }, {
    value: 'Bus trip',
    icon: 'maps:directions-bus'
  }
  ...
];

html`<anypoint-chip-input .source="${source}" infoMessage="Type 'b' in the input">
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

### Restoring values from suggestions with icons

Value can be restored by passing previous value to `chipsValue` property.

```javascript
const source = [
  {
    value: 'Biking',
    icon: 'maps:directions-bike'
  }, {
    value: 'Boat trip',
    icon: 'maps:directions-boat'
  }, {
    value: 'Bus trip',
    icon: 'maps:directions-bus'
  }
  ...
];
const chipsValue = ['Biking', 'Shopping'];

html`<anypoint-chip-input
  .source="${source}"
  .chipsValue="${chipsValue}"
>
  <label slot="label">Enter value</label>
</anypoint-chip-input>`
```

### Allowed chips

It is possible to limit the input to a set list of values by passing allowed list to the `allowed` property.

```javascript
const allowed = ['apple', 'Orange', 'BANANA`'];
html`<anypoint-chip-input
  .allowed="${allowed}"
  infoMessage="Only: Apple, Orange, and Banana">
  <label slot="label">Only allowed will become chips and value</label>
</anypoint-chip-input>`
```

### Suggestions with IDs

When `source` contains an `id` property on an item, the `id` is returned in the `chipsValue` instead of the `value`.

```javascript
const source = [
  {
    value: 'Biking',
    icon: 'maps:directions-bike',
    id: 'activity-1'
  }, {
    value: 'Boat trip',
    icon: 'maps:directions-boat',
    id: 'activity-2'
  }, {
    value: 'Bus trip',
    icon: 'maps:directions-bus',
    id: 'activity-3'
  }
  ...
];
html`<anypoint-chip-input
  .source="${source}">
  <label slot="label">Type your favourite fruits</label>
</anypoint-chip-input>`
```

### Restoring from IDs

Value can be restored by passing previous value to `chipsValue` property.

```javascript
const source = [
  {
    value: 'Biking',
    icon: 'maps:directions-bike',
    id: 'activity-1'
  }, {
    value: 'Boat trip',
    icon: 'maps:directions-boat',
    id: 'activity-2'
  }, {
    value: 'Bus trip',
    icon: 'maps:directions-bus',
    id: 'activity-3'
  }
  ...
];
const value = ['activity-1'];
html`<anypoint-chip-input
  .source="${source}"
  .chipsValue="${value}">
  <label slot="label">Type your favourite fruits</label>
</anypoint-chip-input>`
```

## Development

```sh
git clone https://github.com/anypoint-web-components/anypoint-chip-input
cd anypoint-chip-input
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests
```sh
npm test
```
