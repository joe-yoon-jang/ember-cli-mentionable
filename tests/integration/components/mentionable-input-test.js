import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import { keyEvent } from 'ember-native-dom-helpers';

const DUMMY_DATA = ['foo', 'bar', 'baz'];

moduleForComponent('mentionable-input', 'Integration | Component | mentionable input', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs `{{mentionable-input}}`);

  assert.equal(this.$('ul').text().trim(), '');

});

test('it renders picker results', function(assert) {
  const mentionableData = [{
    data: DUMMY_DATA
  }];
  this.set('mentionableData', mentionableData)
  this.render(hbs `
    {{mentionable-input
      data=mentionableData
    }}
  `);

  this.$('input').val('@b').trigger('keyup');
  return wait().then(() => {
    assert.ok(this.$('ul').text().trim().includes('bar'));
    assert.ok(this.$('ul').text().trim().includes('baz'));
  });
});

test('it renders no results found', function(assert) {
  const mentionableData = [{
    data: DUMMY_DATA
  }];
  this.set('mentionableData', mentionableData)
  this.render(hbs `
    {{mentionable-input
      data=mentionableData
    }}
  `);

  this.$('input').val('@bo').trigger('keyup');
  return wait().then(() => {
    assert.ok(this.$('ul').text().trim().includes('no results'));
  });
});

test('it clears picker results', function(assert) {
  const mentionableData = [{
    data: DUMMY_DATA
  }];
  this.set('mentionableData', mentionableData)
  this.render(hbs `
    {{mentionable-input
      data=mentionableData
    }}
  `);

  this.$('input').val('@f').trigger('keyup');
  return wait().then(() => {
    assert.ok(this.$('ul').text().trim().includes('foo'));
    this.$('input').val('xxx').trigger('keyup');
    return wait().then(() => {
      assert.equal(this.$('ul').text().trim(), '');
    });
  });
});


test('it sets results from click', function(assert) {
  const mentionableData = [{
    data: DUMMY_DATA
  }];
  this.set('testValue', '');
  this.set('mentionableData', mentionableData)
  this.render(hbs `
    {{mentionable-input
      data=mentionableData
      value=testValue
    }}
  `);

  this.$('input').val('@b').trigger('keyup');
  return wait().then(() => {
    assert.ok(this.$('ul').text().trim().includes('bar'));
    assert.ok(this.$('ul').text().trim().includes('baz'));
    this.$('li').first().click();
    return wait().then(() => {
      assert.ok(this.$('input').val().trim().includes('bar'));
    });
  });
});


test('it sets results from keyboard', function(assert) {
  const mentionableData = [{
    data: DUMMY_DATA
  }];
  this.set('testValue', 'x');
  this.set('mentionableData', mentionableData)
  this.render(hbs `
    {{mentionable-input
      data=mentionableData
      value=testValue
    }}
  `);

  this.$('input').val('@b').trigger('keyup');
  return wait().then(() => {
    assert.ok(this.$('ul').text().trim().includes('bar'));
    assert.ok(this.$('ul').text().trim().includes('baz'));

    keyEvent('input', 'keyup', 38);
    keyEvent('ul.mentionable-picker li', 'keydown', 13);
    return wait().then(() => {
      assert.equal(this.get('testValue').trim(), '@bar');
    });
  });
});
