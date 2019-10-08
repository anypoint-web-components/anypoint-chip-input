/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   src/AnypointChipInput.js
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

import {html, css} from 'lit-element';

import {AnypointInput} from '@anypoint-web-components/anypoint-input/src/AnypointInput.js';

export {AnypointChipInput};

declare namespace ApiElements {

  /**
   * `anypoint-chip-input`
   *
   * A material design input with material design chips.
   *
   * It renders chips on the left hand side of the input. It is added as an
   * add-on of the `paper-input` element.
   *
   * It allows to provide list of suggestions that are rendered is user input
   * allows to render suggestions.
   *
   * ## Example
   *
   * ```html
   * <anypoint-chip-input
   *  required
   *  autovalidate
   *  name="fruits"
   *  allowed='["apple","Orange","BANANA"]'
   *  source='["Apple", "Apricot", 'Banana',"Orange"]'
   *  pattern="[a-zA-Z]+"
   *  invalidmessage="This is not a fruit name!">
   *    <label slot="label">List your favourite fruits</label>
   *  </anypoint-chip-input>
   * ```
   *
   * ## Styling
   *
   * Use `anypoint-input` and `anypoint-chip` styles to style the element.
   */
  class AnypointChipInput extends AnypointInput {

    /**
     * A list of chip items to render
     */
    chips: Array<object|null>|null;
    value: any;

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
     */
    source: any;
    chipsValue: any;
    onchipschanged: Function|null;
    chipRemoveIcon: SVGTemplateResult|null;

    /**
     * List of allowed chips labels. Character case does not matter.
     */
    allowed: Array<String|null>|null;
    render(): any;
    _prefixTemplate(): any;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _registerCallback(eventType: any, value: any): void;

    /**
     * Computes value for paper-chip's `removable` property.
     *
     * @param item `chips` list item.
     */
    _computeChipRemovable(item: object|null): Boolean|null;

    /**
     * Adds a new chip to the list of chips.
     *
     * @param label Label of the chip
     * @param removable True if the chip can be removed.
     * @param icon An icon to pass to the chip.
     * @param id An ID to be used as a value.
     */
    addChip(label: String|null, removable: Boolean|null, icon: String|null, id: String|null): void;

    /**
     * Restores chips from passed value.
     * When input's (this element) value change it computes list of chips
     *
     * @param value List of chips definitions
     * @param source List of suggestions
     */
    _computeChipsValues(value: Array<object|null>|null, source: Array<object|null>|null): void;

    /**
     * Finsd a suggestion source in the list of suggestions.
     * Primarly it looks for a value (lowercasing it) and then it compares
     * `id` if defined.
     *
     * @param source List of suggestions passed to the element
     * @param value Search value. Should be lowercased before calling this function
     * @param id Optional ID to compare.
     * @returns Suggestion source or undefined if not found.
     */
    _findSource(source: Array<object|String|null>|null, value: String|null, id: String|null): String|object|null|undefined;

    /**
     * Tests if given value is allowed to enter when `allowed` property is set.
     *
     * @param value The value to test
     * @param id The Suggestion id, if any.
     * @returns True if the value is allowed as a chip label.
     */
    _isAllowed(value: String|null, id: String|null): Boolean|null;

    /**
     * Removes a chip on a specific index.
     *
     * @param index Index of the chip in the `chips` array
     */
    _removeChip(index: Number|null): void;

    /**
     * Validates the input element and sets an error style if needed.
     */
    _getValidity(): boolean;

    /**
     * Handler for `chip-removed` event.
     */
    _chipRemovedHandler(e: CustomEvent|null): void;
    _keydownHandler(e: any): void;
    _enterDown(e: any): void;
    _backspaceDown(e: any): void;
    _selectedHandler(e: any): void;
    _processAddInput(value: any): void;
    _focusBlurHandler(e: any): void;

    /**
     * When autocomplete is enabled, the user type in a value and as a result the
     * autocomplete closes itself for a lack of syggestion the input looses focus
     * for a tick. This checks in a debouncer whether the input still has focus and
     * if not it commits the value to the chip model.
     */
    _tryBlurHandler(): void;
    _autocompleteTemplate(): any;
    _renderChipsTemplate(): any;
    _itemIconTemplate(item: any): any;
  }
}
