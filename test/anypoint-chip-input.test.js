import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import '@polymer/iron-icons/iron-icons.js';
import * as MockInteractions from '@polymer/iron-test-helpers/mock-interactions.js';
import { clearAll, clear } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import { directionsBike, directionsBoat, directionsBus } from '../demo/maps-icons.js';
import '../anypoint-chip-input.js';

/** @typedef {import('../index').AnypointChipInput} AnypointChipInput */

describe('<anypoint-chip-input>', () => {
  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function basicFixture() {
    return (fixture(`<anypoint-chip-input></anypoint-chip-input>`));
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function basicRequiredFixture() {
    return (fixture(`<anypoint-chip-input required></anypoint-chip-input>`));
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function patternFixture() {
    return fixture(`<anypoint-chip-input pattern="[a-zA-Z]+"></anypoint-chip-input>`);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function chipsFixture() {
    const chips = [{
      label: 'c-1'
    }, {
      label: 'c-2',
      removable: true
    }, {
      label: 'c-3'
    }];
    return fixture(html`
      <anypoint-chip-input
        .chips="${chips}"></anypoint-chip-input>`);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function chipsWithIconFixture() {
    const chips = [{
      label: 'c-1'
    }, {
      label: 'c-2',
      removable: true
    }, {
      label: 'c-3'
    }];
    return fixture(html`
      <anypoint-chip-input
        .chipRemoveIcon="${clearAll}"
        .chips="${chips}"></anypoint-chip-input>`);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function allRemoveFixture() {
    const chips = [
      { label: 'c-1', removable: true },
      { label: 'c-2', removable: true },
      { label: 'c-3', removable: true }
    ];
    return fixture(html`
      <anypoint-chip-input
        .chips='${chips}'></anypoint-chip-input>
    `);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function allowedFixture() {
    const allowed = ['c1', 'c2', 'c-3'];
    return fixture(html`
      <anypoint-chip-input
        .allowed="${allowed}"></anypoint-chip-input>
    `);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function suggestionsFixture() {
    return fixture(`
      <anypoint-chip-input source='["c1", "c2", "c-3"]'></anypoint-chip-input>
    `);
  }

  /**
   * @returns {Promise<AnypointChipInput>}
   */
  async function suggestionsWithIconsFixture() {
    const source = [
      { value: 'c1', icon: directionsBike },
      { value: 'c2', icon: directionsBoat },
      { value: 'c3', icon: directionsBus },
    ];
    return fixture(html`
      <anypoint-chip-input
        name="test"
        .source="${source}">
        <label slot="label">x</label>
      </anypoint-chip-input>
    `);
  }

  describe('Adding a chip', () => {
    let element = /** @type AnypointChipInput */ (null);

    it('chipsValue is initially undefined', async () => {
      element = await basicFixture();
      assert.isEmpty(element.chipsValue);
    });

    it('accepts chip from the value', async () => {
      element = await basicFixture();
      element.value = 'test';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 1);
      assert.equal(element.chipsValue[0], 'test');
    });

    it('ignores empty values', async () => {
      element = await basicFixture();
      element.value = '';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.isEmpty(element.chipsValue);
    });

    it('clears input value after accepting input', async () => {
      element = await basicFixture();
      element.value = 'test';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.equal(element.value, '');
    });

    it('ignores existing value', async () => {
      element = await chipsFixture();
      element.value = 'c-1';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 3);
    });

    it('clears input value after ignoring it', async () => {
      element = await chipsFixture();
      element.value = 'c-1';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.equal(element.value, '');
    });
    // TODO (pawel): Wht is this ????
    it('allows only "allowed" chips (by value)', async () => {
      element = await allowedFixture();
      element.value = 'c1';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.equal(element.value, '');
    });

    it('ignores values not defined in "allowed" (by value)', async () => {
      element = await allowedFixture();
      element.value = 'c1';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.typeOf(element.chipsValue, 'array');
      assert.equal(element.chipsValue[0], 'c1');
    });

    it('allows only "allowed" chips (by id)', async () => {
      element = await allowedFixture();
      element.source = [{ value: 'c1 label', id: 'c1' }];
      element.value = 'c1 label';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.typeOf(element.chipsValue, 'array');
      assert.equal(element.chipsValue[0], 'c1');
    });

    it('Ignores values not defined in "allowed" (by id)', async () => {
      element = await allowedFixture();
      element.source = [{ value: 'c1 label', id: 'c-not-allowed' }];
      await nextFrame();
      element.value = 'c1 label';
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.isEmpty(element.chipsValue, 'array');
    });
  });

  describe('Removing a chip', () => {
    let element = /** @type AnypointChipInput */ (null);
    it('does nothing when no input and no chips', async () => {
      element = await basicFixture();
    });

    it('do not removes chips when input has text', async () => {
      element = await allRemoveFixture();
      element.value = 'test';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 8, [], 'Backspace');
      await nextFrame();
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 3);
    });

    it('Removes the chip when input is empty', async () => {
      element = await allRemoveFixture();
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 8, [], 'Backspace');
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 2);
      assert.deepEqual(element.chipsValue, ['c-1', 'c-2']);
    });

    it('removes only removable chips', async () => {
      element = await chipsFixture();
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 8, [], 'Backspace');
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 2);
      assert.deepEqual(element.chipsValue, ['c-1', 'c-3']);
    });

    it('Enters chip label into the input field', async () => {
      element = await allRemoveFixture();
      MockInteractions.keyDownOn(element.inputElement, 8, [], 'Backspace');
      await aTimeout(0);
      assert.equal(element.value, 'c-3');
    });

    it('Handles remove event', async () => {
      element = await chipsFixture();
      const node = element.shadowRoot.querySelectorAll('anypoint-chip')[1];
      node.dispatchEvent(new CustomEvent('chip-removed', {
        composed: true
      }));
      assert.typeOf(element.chipsValue, 'array');
      assert.lengthOf(element.chipsValue, 2);
      assert.deepEqual(element.chipsValue, ['c-1', 'c-3']);
    });
  });

  describe('Allowed chips', () => {
    let element = /** @type AnypointChipInput */ (null);
    beforeEach(async () => {
      element = await allowedFixture();
    });

    it('Accepts allowed value', async () => {
      element.value = 'c1';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.equal(element.chipsValue[0], 'c1');
    });

    it('Ignores unknown value', async () => {
      element.value = 'unknown';
      await nextFrame();
      MockInteractions.keyDownOn(element.inputElement, 13, [], 'Enter');
      await nextFrame();
      assert.isEmpty(element.chipsValue);
    });
  });

  describe('Auto suggestions', () => {
    let element = /** @type AnypointChipInput */ (null);
    beforeEach(async () => {
      element = await suggestionsFixture();
    });

    it('0pens suggestions dropdown', async () => {
      element.value = 'c';
      await nextFrame();
      element.inputElement.dispatchEvent(new CustomEvent('input'))
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-autocomplete');
      assert.isTrue(node.opened);
    });

    it('Does no open suggestions when filtered empty', async () => {
      element.value = 'cz';
      await nextFrame();
      element.inputElement.dispatchEvent(new CustomEvent('input'))
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-autocomplete');
      assert.isFalse(node.opened);
    });

    it('Accepts suggestion', async () => {
      element.value = 'c';
      await nextFrame();
      element.inputElement.dispatchEvent(new CustomEvent('input'))
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-autocomplete');
      node.dispatchEvent(new CustomEvent('selected', {
        composed: true,
        detail: {
          value: {
            value: 'c1'
          }
        }
      }));
      assert.equal(element.value, '');
      assert.equal(element.chipsValue[0], 'c1');
    });
  });

  describe('Value computation', () => {
    let element = /** @type AnypointChipInput */ (null);

    it('creates chips from chipsValue', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1', 'test2'];
      assert.typeOf(element.chips, 'array');
      assert.lengthOf(element.chips, 2);
    });

    it('created chip is removable', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1'];
      assert.isTrue(element.chips[0].removable);
    });

    it('created chip has label from value', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1'];
      assert.equal(element.chips[0].label, 'test1');
    });

    it('Value is unchanged', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1'];
      assert.isUndefined(element.value);
    });

    it('Uses suggestions to render chips', async () => {
      element = await suggestionsWithIconsFixture();
      element.chipsValue = ['c2'];
      assert.equal(element.chips[0].label, 'c2', 'Has label');
      assert.isTrue(element.chips[0].removable, 'Is removable');
      assert.equal(element.chips[0].icon, directionsBoat, 'Has icon');
    });

    it('Removes chips when value is empty array', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1', 'test2'];
      await nextFrame();
      element.chipsValue = [];
      assert.lengthOf(element.chips, 0);
    });

    it('Removes chips when value is undefined', async () => {
      element = await basicFixture();
      element.chipsValue = ['test1', 'test2'];
      await nextFrame();
      element.chipsValue = undefined;
      assert.lengthOf(element.chips, 0);
    });
  });

  describe('Input blur', () => {
    let element = /** @type AnypointChipInput */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('commits value to a chip when blur', async () => {
      element.value = 'test';
      await nextFrame();
      MockInteractions.focus(element);
      await nextFrame();
      MockInteractions.blur(element);
      await aTimeout(0);
      assert.equal(element.value, '', 'input value is cleared');
      assert.deepEqual(element.chipsValue, ['test'], 'chipsValue has the value');
    });

    it('ignores when no value', async () => {
      element.value = '';
      await nextFrame();
      MockInteractions.focus(element);
      await nextFrame();
      MockInteractions.blur(element);
      await aTimeout(0);
      assert.deepEqual(element.chipsValue, [], 'chipsValue has no value');
    });

    it('ignores when refocusing', async () => {
      element.value = '';
      await nextFrame();
      MockInteractions.focus(element);
      await nextFrame();
      MockInteractions.blur(element);
      MockInteractions.focus(element);
      await aTimeout(0);
      assert.deepEqual(element.chipsValue, [], 'chipsValue has no value');
    });
  });

  describe('validate()', () => {
    it('Returns true when no chips', async () => {
      const element = await basicFixture();
      await nextFrame();
      const result = element.validate();
      assert.isTrue(result);
    });

    it('Returns false when no chips and required', async () => {
      const element = await basicRequiredFixture();
      element.value = ['test'];
      await nextFrame();
      element._removeChip(0);
      const result = element.validate();
      assert.isFalse(result);
    });

    it('Returns false when pattern do not match', async () => {
      const element = await patternFixture();
      element.chipsValue = ['test'];
      element.value = 'test value';
      await nextFrame();
      const result = element.validate();
      assert.isFalse(result);
    });
  });

  describe('_findSource()', () => {
    let element = /** @type AnypointChipInput */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns undefine when no source', () => {
      const result = element._findSource(undefined, undefined);
      assert.isUndefined(result);
    });

    it('Returns undefine when source empty', () => {
      const result = element._findSource([], undefined);
      assert.isUndefined(result);
    });

    it('Finds string item by value', () => {
      const result = element._findSource(['test'], 'test');
      // @ts-ignore
      assert.equal(result, 'test');
    });

    it('Ignores empty values', () => {
      const result = element._findSource(['', 'test'], 'test');
      // @ts-ignore
      assert.equal(result, 'test');
    });

    it('Ignores case of source', () => {
      const result = element._findSource(['', 'Test'], 'test');
      // @ts-ignore
      assert.equal(result, 'Test');
    });

    it('Returns undefined when not found', () => {
      const result = element._findSource(['Test'], 'other');
      assert.isUndefined(result);
    });

    it('Finds string item by id', () => {
      const result = element._findSource(['test'], '', 'test');
      // @ts-ignore
      assert.equal(result, 'test');
    });

    it('Finds object item by value', () => {
      const result = element._findSource([{ value: 'test' }], 'test');
      assert.deepEqual(result, { value: 'test' });
    });

    it('Finds object item by id', () => {
      const result = element._findSource([{ value: 'test', id: 'other' }], 'other', 'other');
      assert.deepEqual(result, { value: 'test', id: 'other' });
    });

    it('Returns undefined when not found in objects', () => {
      const result = element._findSource([{ value: 'test', id: 'id' }], 'other', 'other');
      assert.isUndefined(result);
    });

    it('Returns undefined when not found in objects and no id', () => {
      const result = element._findSource([{ value: 'test', id: 'id' }], 'other');
      assert.isUndefined(result);
    });
  });

  describe('Chip icon', () => {
    let element = /** @type AnypointChipInput */ (null);
    it('has default icon on the chip', async () => {
      element = await chipsFixture();
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-chip');
      assert.equal(node.removeIcon, clear);
    });

    it('has the icon from attribute', async () => {
      element = await chipsWithIconFixture();
      await nextFrame();
      const node = element.shadowRoot.querySelector('anypoint-chip');
      assert.equal(node.removeIcon, clearAll);
    });
  });

  describe('onchipschanged', () => {
    let element = /** @type AnypointChipInput */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Getter returns previously registered handler', () => {
      assert.isUndefined(element.onchipschanged);
      const f = () => {};
      element.onchipschanged = f;
      assert.isTrue(element.onchipschanged === f);
    });

    it('Calls registered function', () => {
      let called = false;
      const f = () => {
        called = true;
      };
      element.onchipschanged = f;
      element.chipsValue = ['a'];
      element.onchipschanged = null;
      assert.isTrue(called);
    });

    it('Unregisteres old function', () => {
      let called1 = false;
      let called2 = false;
      const f1 = () => {
        called1 = true;
      };
      const f2 = () => {
        called2 = true;
      };
      element.onchipschanged = f1;
      element.onchipschanged = f2;
      element.chipsValue = ['a'];
      element.onchipschanged = null;
      assert.isFalse(called1);
      assert.isTrue(called2);
    });
  });

  describe('a11y', () => {
    it('passes tests in normal state', async () => {
      const element = await fixture(`<anypoint-chip-input
        name="i1">
        <label slot="label">x</label>
      </anypoint-chip-input>`);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-hidden-focus'],
      });
    });

    it('passes tests when required', async () => {
      const element = await fixture(`<anypoint-chip-input
        name="i1"
        required>
        <label slot="label">x</label>
      </anypoint-chip-input>`);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-hidden-focus'],
      });
    });

    it('passes tests when disabled', async () => {
      const element = await fixture(`<anypoint-chip-input
        name="i1"
        disabled>
        <label slot="label">x</label>
      </anypoint-chip-input>`);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-hidden-focus'],
      });
    });

    it('passes tests when readOnly', async () => {
      const element = await fixture(`<anypoint-chip-input
        name="i1"
        readOnly>
        <label slot="label">x</label>
      </anypoint-chip-input>`);
      await assert.isAccessible(element, {
        ignoredRules: ['aria-hidden-focus'],
      });
    });

    it('passes tests when suggestions', async () => {
      const element = await suggestionsWithIconsFixture();
      await assert.isAccessible(element, {
        ignoredRules: ['aria-hidden-focus'],
      });
    });
  });
});
