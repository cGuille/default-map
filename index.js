(function (undefined) {
  'use strict';

  module.exports = DefaultMap;

  var DEFAULT_OPTIONS = {
    // You should specify one (and only one) of the two following options:
    defaultValue: undefined,
    defaultGenerator: undefined,
  };

  function DefaultMap(options) {
    this.map = {};
    this.keys = {};
    this.options = mergeDefaultOptions.call(this, options || {});
    this.defaultValue = this.options.defaultValue;
    this.defaultGenerator = this.options.defaultGenerator;
    this.hasGenerator = typeof(this.defaultGenerator) === 'function';
  }

  DefaultMap.fromHash = function DefaultMap_fromHash(data, options) {
    var instance = new DefaultMap(options);
    var key;

    for (key in data) {
      if (data.hasOwnProperty(key)) {
        instance.set(key, data[key]);
      }
    }

    return instance;
  };

  DefaultMap.prototype.toHash = function DefaultMap_toHash() {
    var hash = {};
    this.forEach(function (value, key) {
        hash[key] = value;
    });
    return hash;
  };

  DefaultMap.prototype.set = function DefaultMap_set(key, value) {
    this.map[key] = value;
    this.keys[key] = true;
  };

  DefaultMap.prototype.has = function DefaultMap_has(key) {
    return !!this.keys[key];
  };

  DefaultMap.prototype.delete = function DefaultMap_delete(key) {
    delete this.keys[key];
    delete this.map[key];
  };

  DefaultMap.prototype.get = function DefaultMap_get(key) {
    if (!this.has(key)) {
      assignDefaultValue.call(this, key);
    }
    return this.map[key];
  };

  DefaultMap.prototype.forEach = function DefaultMap_forEach(fn) {
    for (var key in this.map) {
      if (this.map.hasOwnProperty(key)) {
        fn(this.map[key], key);
      }
    }
  };

  function assignDefaultValue(key) {
    var newValue;
    if (!this.hasGenerator) {
      newValue = this.defaultValue;
    } else {
      newValue = this.defaultGenerator(key);
    }

    this.map[key] = newValue;
    this.keys[key] = true;
  }

  function mergeDefaultOptions(userOptions) {
    for (var optionName in DEFAULT_OPTIONS) {
      if (
        DEFAULT_OPTIONS.hasOwnProperty(optionName) &&
        userOptions[optionName] === undefined
      ) {
          userOptions[optionName] = DEFAULT_OPTIONS[optionName];
      }
    }
    return userOptions;
  }
}())
