/*
Copyright 2018 Pawel Psztyc, The ARC team
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { html, css } from 'lit-element';
import { AnypointInput } from '@anypoint-web-components/anypoint-input/src/AnypointInput.js';
import '@anypoint-web-components/anypoint-autocomplete/anypoint-autocomplete.js';
import '@anypoint-web-components/anypoint-chip/anypoint-chip.js';
/**
 * `anypoint-chip-input`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof ApiElements
 * @extends AnypointInput
 */
export class AnypointChipInput extends AnypointInput {
  get styles() {
    return [
      super.styles,
      css`:host {
        position: relative;
        width: auto;
        min-width: 170px;
        min-height: 56px;
        height: auto;
      }

      .chips {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
      }

      .prefixes {
        max-width: 60%;
      }

      .input-container {
        min-height: inherit;
      }

      :host([compatibility]) {
        min-height: 40px;
        height: 40px;
      }

      .icon {
        fill: currentColor;
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 0 0 0 8px;
        vertical-align: middle;
      }`
    ];
  }

  static get properties() {
    return {
      /**
       * A list of chip items to render
       * @type {Array<Object>} Each array item must have `label` property
       * for the chip. It can contain `removable` property it the chip can
       * be removed. It is added by default when chip's source is user input.
       */
      chips: { type: Array },
      /**
       * List of allowed chips labels. Character case does not matter.
       * @type {Array<String>}
       */
      allowed: { type: Array },
      /**
       * List of suggestions to render when the user type in the input field.
       *
       * Each array item can be a string which will be compared to user input.
       * If the item is an object is must contain the `value` property which
       * is used to compare the values. It can also contain an `icon` property
       * which value is an instance of `SVGTemplateResult` from `lit-html`
       * library.
       *
       * If the suggestion item contains `id` property it's value will be returned
       * as a value of the input. Otherwise `value` is used.
       *
       * ### Example
       *
       * ```json
       * [
       *  "item 1",
       *  {
       *    "value": "Other item",
       *    "icon": svg`...`
       *  },
       *  {
       *    "value": "Rendered label",
       *    "id": "returned-value"
       *  }
       * ]
       * ```
       *
       * @type {Object<Stirng|Object>}
       */
      source: { type: Array }
    };
  }
  /**
   * @return {Array<Object>} previouslt set chips model.
   */
  get chips() {
    return this._chips;
  }
  /**
   * A list of chip items to render
   * @param {Array<Object>} value Each array item must have `label` property
   * for the chip. It can contain `removable` property it the chip can
   * be removed. It is added by default when chip's source is user input.
   */
  set chips(value) {
    const oldValue = this._chips;
    if (oldValue === value) {
      return;
    }
    this._chips = value;
    this.requestUpdate('chips', oldValue);
    this.dispatchEvent(new CustomEvent('chips-changed', {
      composed: true,
      detail: {
        value: this.chipsValue
      }
    }));
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const oldValue = this._value;
    if (oldValue === value) {
      return;
    }
    // just in case if someone mixed chipsValue with value.
    // Web standards suggest that the elements should not throw errors in
    // such situation but rather handle it quietly.
    if (Array.isArray(value)) {
      value = '';
    }
    this._value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      composed: true,
      detail: {
        value
      }
    }));
    this.requestUpdate('value', oldValue);
  }

  get source() {
    return this._source;
  }

  set source(value) {
    const oldValue = this._source;
    this._source = value;
    this.requestUpdate('source', oldValue);
    this._computeChipsValues(this.chipsValue, value);
    if (value && value.length) {
      this.setAttribute('aria-autocomplete', 'list');
    } else {
      this.removeAttribute('aria-autocomplete');
    }
  }

  get chipsValue() {
    return (this.chips || []).map((item) => item.id || item.label);
  }

  set chipsValue(value) {
    this._computeChipsValues(value, this.source);
  }

  /**
   * @return {Function} Previously registered handler for `chips-changed` event
   */
  get onchipschanged() {
    return this['_onchips-changed'];
  }
  /**
   * Registers a callback function for `chips-changed` event
   * @param {Function} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onchipschanged(value) {
    this._registerCallback('chips-changed', value);
  }

  /**
   * @return {SVGTemplateResult} An icon to render when `removable` is set.
   * Can be undefined if not previously set.
   */
  get chipRemoveIcon() {
    return this._chipRemoveIcon;
  }
  /**
   * @param {SVGTemplateResult} value An icon to be used to render "remove" icon.
   * It must be an instance of `SVGTemplateResult` that can be created from `lit-html`
   * library.
   *
   * ```javascript
   * import { svg } from 'lit-html';
   * const icon = svg`...`; // content of the icon.
   * ```
   */
  set chipRemoveIcon(value) {
    const old = this._chipRemoveIcon;
    this._chipRemoveIcon = value;
    this.requestUpdate('chipRemoveIcon', old);
  }

  constructor() {
    super();
    this._keydownHandler = this._keydownHandler.bind(this);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('keydown', this._keydownHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this._keydownHandler);
  }

  _registerCallback(eventType, value) {
    const key = `_on${eventType}`;
    if (this[key]) {
      this.removeEventListener(eventType, this[key]);
    }
    if (typeof value !== 'function') {
      this[key] = null;
      return;
    }
    this[key] = value;
    this.addEventListener(eventType, value);
  }
  /**
   * Computes value for paper-chip's `removable` property.
   * @param {Object} item `chips` list item.
   * @return {Boolean}
   */
  _computeChipRemovable(item) {
    return !!(item && item.removable);
  }

  /**
   * Adds a new chip to the list of chips.
   * @param {String} label Label of the chip
   * @param {?Boolean} removable True if the chip can be removed.
   * @param {?String} icon An icon to pass to the chip.
   * @param {?String} id An ID to be used as a value.
   */
  addChip(label, removable, icon, id) {
    const chips = this.chips || [];
    for (let i = 0, len = chips.length; i < len; i++) {
      if (chips[i].label === label) {
        // TODO: highlight the chip?
        return;
      }
    }
    this.chips = [...chips, {
      label,
      removable,
      icon,
      id
    }];
  }
  /**
   * Restores chips from passed value.
   * When input's (this element) value change it computes list of chips
   * @param {Array<Object>} value List of chips definitions
   * @param {Array<Object>} source List of suggestions
   */
  _computeChipsValues(value, source) {
    if (!value || !value.length) {
      if (this.chips) {
        this.chips = [];
      }
      return;
    }
    source = source || [];
    const newChips = [];
    for (let i = 0, len = value.length; i < len; i++) {
      const _value = value[i];
      if (!_value || typeof _value !== 'string') {
        continue;
      }
      const _lowerValue = _value.toLowerCase();
      const _source = this._findSource(source, _lowerValue, _value);
      const chip = {
        removable: true
      };
      if (_source && typeof _source === 'object') {
        chip.label = _source.value;
        chip.icon = _source.icon;
        chip.id = _source.id;
      } else {
        chip.label = _value;
      }
      newChips[newChips.length] = chip;
    }
    this.chips = newChips;
  }
  /**
   * Finsd a suggestion source in the list of suggestions.
   * Primarly it looks for a value (lowercasing it) and then it compares
   * `id` if defined.
   * @param {Array<Object|String>} source List of suggestions passed to the element
   * @param {String} value Search value. Should be lowercased before calling this function
   * @param {?String} id Optional ID to compare.
   * @return {String|Object|undefined} Suggestion source or undefined if not found.
   */
  _findSource(source, value, id) {
    if (!source || !source.length) {
      return;
    }
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      if (typeof item === 'string') {
        if (!item) {
          // Empty string
          continue;
        }
        const lowerItem = item.toLowerCase();
        if (lowerItem === value || lowerItem === id) {
          return item;
        }
        continue;
      }
      const itemValue = source[i].value;
      if (itemValue && typeof itemValue === 'string' && itemValue.toLowerCase() === value) {
        return item;
      }
      if (!id) {
        continue;
      }
      const itemId = source[i].id;
      if (itemId && itemId === id) {
        return item;
      }
    }
  }
  /**
   * Tests if given value is allowed to enter when `allowed` property is set.
   * @param {String} value The value to test
   * @param {?String} id The Suggestion id, if any.
   * @return {Boolean} True if the value is allowed as a chip label.
   */
  _isAllowed(value, id) {
    const allowed = this.allowed;
    if (!allowed || !allowed.length || !value) {
      return true;
    }
    const lowerValue = value.toLowerCase();
    for (let i = 0, len = allowed.length; i < len; i++) {
      if (id && id === allowed[i]) {
        return true;
      }
      if (allowed[i].toLowerCase && allowed[i].toLowerCase() === lowerValue) {
        return true;
      }
    }
    return false;
  }
  /**
   * Removes a chip on a specific index.
   *
   * @param {Number} index Index of the chip in the `chips` array
   */
  _removeChip(index) {
    const chips = this.chips;
    if (!chips || !chips.length) {
      return;
    }
    chips.splice(index, 1);
    this.chips = Array.from(chips);
    if (chips.length === 0) {
      this.validate();
    }
  }
  /**
   * Validates the input element and sets an error style if needed.
   *
   * @return {boolean}
   */
  _getValidity() {
    if (this.chips === undefined) {
      return true;
    }
    const hasChips = this.chips && this.chips.length;
    if (this.required && !hasChips) {
      this._inputElement.invalid = true;
      return false;
    }
    return this._inputElement.validate();
  }

  /**
   * Handler for `chip-removed` event.
   * @param {CustomEvent} e
   */
  _chipRemovedHandler(e) {
    const index = Number(e.target.dataset.index);
    if (index !== index) {
      return;
    }
    this._removeChip(index);
  }

  _keydownHandler(e) {
    if (e.key === 'Enter') {
      this._enterDown(e);
    } else if (e.key === 'Backspace') {
      this._backspaceDown(e);
    }
  }

  _enterDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.validate()) {
      return;
    }
    const value = this.value;
    if (!value) {
      return;
    }
    this._processAddInput(value);
  }

  _backspaceDown(e) {
    const chips = this.chips;
    if (this.value || !chips || !chips.length) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let removeIndex = -1;
    for (let i = chips.length - 1; i >= 0; i--) {
      if (chips[i].removable) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex === -1) {
      return;
    }
    const chip = chips[removeIndex];
    this._removeChip(removeIndex);
    setTimeout(() => {
      this.value = chip.label;
    });
  }

  _selectedHandler(e) {
    let value = e.detail.value;
    if (!value) {
      return;
    }
    if (value.value) {
      // for complex suggestions
      value = value.value;
    }
    this._processAddInput(value);
    this.inputElement.value = '';
  }

  _processAddInput(value) {
    const lowerValue = value.toLowerCase();
    const source = this._findSource(this.source, lowerValue);
    const id = source && source.id;
    if (!this._isAllowed(value, id)) {
      return;
    }
    const icon = source && source.icon;
    this.addChip(value, true, icon, id);
    this.value = '';
  }

  _focusBlurHandler(e) {
    super._focusBlurHandler(e);
    if (e.type === 'blur' && this.validate()) {
      this._tryBlurHandler();
    }
  }
  /**
   * When autocomplete is enabled, the user type in a value and as a result the
   * autocomplete closes itself for a lack of syggestion the input looses focus
   * for a tick. This checks in a debouncer whether the input still has focus and
   * if not it commits the value to the chip model.
   */
  _tryBlurHandler() {
    setTimeout(() => {
      const value = this.value;
      if (!this.focused && value) {
        this._processAddInput(value);
      }
    });
  }

  _prefixTemplate() {
    return html`<div class="prefixes">
      <div class="chips">
      ${this._renderChipsTemplate()}
      </div>
      <slot name="prefix"></slot>
    </div>`;
  }

  _autocompleteTemplate() {
    return html`<anypoint-autocomplete
      .target="${this.inputElement}"
      .source="${this.source}"
      ?compatibility="${this.compatibility}"
      @selected="${this._selectedHandler}"></anypoint-autocomplete>`;
  }

  _renderChipsTemplate() {
    const { chips } = this;
    if (!chips || !chips.length) {
      return;
    }
    return chips.map((item, index) => html`
    <anypoint-chip
      .removable="${this._computeChipRemovable(item)}"
      @chip-removed="${this._chipRemovedHandler}"
      tabindex="-1"
      .removeIcon="${this.chipRemoveIcon}"
      ?compatibility="${this.compatibility}"
      data-index="${index}">
      ${this._itemIconTemplate(item)}
      ${item.label}
    </anypoint-chip>
    `);
  }

  _itemIconTemplate(item) {
    if (!item.icon) {
      return '';
    }
    return html`<span
      class="icon"
      slot="icon"
    >${item.icon}</span>`;
  }

  render() {
    return html`
    <style>${this.styles}</style>
    <div class="input-container">
      ${this._prefixTemplate()}
      <div class="input-label">
        ${this._labelTemplate()}
        ${this._inputTemplate()}
      </div>
      ${this._suffixTemplate()}
    </div>
    ${this._assistiveTemplate()}
    ${this._autocompleteTemplate()}
    `;
  }
}
