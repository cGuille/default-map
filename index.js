(function (undefined) {
  'use strict';

  module.exports = DefaultMap;

  var DEFAULT_OPTIONS = {
    // You should specify one (and only one) of the two following options:
    defaultValue: undefined,
    defaultGenerator: undefined,

    // Initial data in the map:
    data: {},
  };

  function DefaultMap(options) {
    this.options = mergeDefaultOptions.call(this, options || {});
    this.map = {};
    this.keys = {};

    this.defaultValue = this.options.defaultValue;
    delete this.options.defaultValue;
    this.defaultGenerator = this.options.defaultGenerator;
    delete this.options.defaultGenerator;
    this.hasGenerator = typeof(this.defaultGenerator) === 'function';

    insertInitialData.call(this);
    delete this.options.data;
  }

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

  DefaultMap.prototype.isEmpty = function DefaultMap_isEmpty() {
    return !Object.getOwnPropertyNames(this.map).length;
  };

  DefaultMap.prototype.forEach = function DefaultMap_forEach(fn, thisArg) {
    for (var key in this.map) {
      if (this.map.hasOwnProperty(key)) {
        fn.call(thisArg, this.map[key], key, this);
      }
    }
  };

  function assignDefaultValue(key) {
    var newValue;
    if (!this.hasGenerator) {
      if (Array.isArray(this.defaultValue)) {
        newValue = this.defaultValue.slice();
      } else if (this.defaultValue instanceof Date) {
        newValue = new Date(this.defaultValue);
      } else if (typeof(this.defaultValue) === 'object') {
        newValue = objectShallowCopy(this.defaultValue);
      } else {
        newValue = this.defaultValue;
      }
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

  function insertInitialData() {
    for (var key in this.options.data) {
      if (this.options.data.hasOwnProperty(key)) {
        this.set(key, this.options.data[key]);
      }
    }
  }

  function objectShallowCopy(original) {
    var clone = Object.create(Object.getPrototypeOf(original));

    Object.getOwnPropertyNames(original).forEach(function (key) {
      Object.defineProperty(
        clone,
        key,
        Object.getOwnPropertyDescriptor(original, key)
      );
    });
    return clone ;
  }
}())
