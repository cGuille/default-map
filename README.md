# DefaultMap

This aims to provide a simple Map prototype with default value / value constructor.

# Installation

```bash
npm install --save default-map
```

# Usage

## Requiring

```js
var DefaultMap = require('default-map');
```

## Initialization

Constructor signature: `DefaultMap(options)`.

### With a default value

```js
var map = new DefaultMap({ defaultValue: 'my default value' });
```

### With a default generator function

```js
var map = new DefaultMap({ defaultGenerator: function (key) {
  return 'the default value for the key: ' + key;
} });
```

### With initial data

Use the `DefaultMap.fromHash(data, options)` method.

```js
var map = DefaultMap.fromHash({ the: 'initial data' }, { defaultValue: 'the default value' });
```

## Checking key existence

```js
map.has('key');
```

## Setting a value to a key

```js
map.set('key', 'value');
```

## Getting the value of key

```js
map.get('foo');
```

If `map` has no key `'foo'`, it will be created using the default value / the default generator.

## Deleting a key

```js
map.delete('foo');
```

## Getting the entry set (useful for JSON serialization)

```js
map.toHash();
```

## Checking if the map is empty

```js
map.isEmpty();
```

## Iterating over the whole entry set

```js
map.forEach(function (value, key, iteratedMap) {
  console.log('Entry:', key, value);
}, this);
```

Note that:

- Giving `this` as the second argument of `DefaultMap#forEach` preserves the calling context's `this`.
- The third argument of the callback contains a reference to the iterated map.
