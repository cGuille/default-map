var DefaultMap = require('..');

describe('DefaultMap', function () {
  function testGenerator(key) {
    return 'generated value for key: "' + key + '").';
  }
  describe('constructor', function () {
      describe('without parameters', function () {
        var defaultMap;
        before(function () { defaultMap = new DefaultMap(); });

        it('creates an instance of the DefaultMap prototype', function () {
            expect(defaultMap).to.be.an.instanceof(DefaultMap);
        });
        it('creates an instance without generator', function () {
            expect(defaultMap.hasGenerator).to.be.false;
        });
        it('creates an instance with an undefined default value', function () {
            expect(defaultMap.defaultValue).to.be.undefined;
        });
        it('creates an instance without any data', function () {
            expect(defaultMap.isEmpty()).to.be.true;
        });
      });

      describe('with a defaultValue', function () {
        var defaultMap;
        var providedDefaultValue = 'foo';
        var options = { defaultValue: providedDefaultValue };
        before(function () { defaultMap = new DefaultMap(options); });

        it('creates an instance of the DefaultMap prototype', function () {
            expect(defaultMap).to.be.an.instanceof(DefaultMap);
        });
        it('creates an instance without generator', function () {
            expect(defaultMap.hasGenerator).to.be.false;
        });
        it('creates an instance with the provided default value', function () {
            expect(defaultMap.defaultValue).to.equal(providedDefaultValue);
        });
        it('creates an instance without any data', function () {
            expect(defaultMap.isEmpty()).to.be.true;
        });
      });

      describe('with a function as defaultValue', function () {
        var defaultMap;
        var providedDefaultValue = function () {};
        var options = { defaultValue: providedDefaultValue };
        before(function () { defaultMap = new DefaultMap(options); });

        it('creates an instance of the DefaultMap prototype', function () {
            expect(defaultMap).to.be.an.instanceof(DefaultMap);
        });
        it('creates an instance without generator', function () {
            expect(defaultMap.hasGenerator).to.be.false;
        });
        it('creates an instance with the provided default value', function () {
            expect(defaultMap.defaultValue).to.equal(providedDefaultValue);
        });
        it('creates an instance without any data', function () {
            expect(defaultMap.isEmpty()).to.be.true;
        });
      });

      describe('with a defaultGenerator', function () {
        var defaultMap;
        var providedDefaultGenerator = testGenerator;
        var options = { defaultGenerator: providedDefaultGenerator };
        before(function () { defaultMap = new DefaultMap(options); });

        it('creates an instance of the DefaultMap prototype', function () {
            expect(defaultMap).to.be.an.instanceof(DefaultMap);
        });
        it('creates an instance with the provided generator', function () {
            expect(defaultMap.hasGenerator).to.be.true;
            expect(defaultMap.defaultGenerator).to.equal(providedDefaultGenerator);
        });
        it('creates an instance with an undefined default value', function () {
            expect(defaultMap.defaultValue).to.be.undefined;
        });
        it('creates an instance without any data', function () {
            expect(defaultMap.isEmpty()).to.be.true;
        });
      });

      describe('with default data', function () {
        var defaultMap;
        var providedData = { initial: 'value' };
        var options = { data: providedData };
        before(function () { defaultMap = new DefaultMap(options); });

        it('creates an instance of the DefaultMap prototype', function () {
            expect(defaultMap).to.be.an.instanceof(DefaultMap);
        });
        it('creates an instance without generator', function () {
            expect(defaultMap.hasGenerator).to.be.false;
        });
        it('creates an instance with an undefined default value', function () {
            expect(defaultMap.defaultValue).to.be.undefined;
        });
        it('creates a non empty instance', function () {
            expect(defaultMap.isEmpty()).to.be.false;
        });
        it('creates an instance which has the provided key', function () {
            expect(defaultMap.has('initial')).to.be.true;
        });
        it('creates an instance which has the provided entry', function () {
            expect(defaultMap.get('initial')).to.deep.equal('value');
        });
      });
  });

  describe('#toHash', function () {
    var defaultMap;
    var providedData = { foo: 'bar', baz: 42, createdAt: new Date() };
    before(function () {
      defaultMap = new DefaultMap({ data: providedData });
    });
    it('returns an objects containing the instance\'s data', function () {
      expect(defaultMap.toHash()).to.deep.equal(providedData);
    });
  });

  describe('#get', function () {
    var defaultMap;
    var providedData = { existingKey: 'existing value' };
    var providedDefaultGenerator = chai.spy(testGenerator);
    before(function () {
      defaultMap = new DefaultMap({ data: providedData, defaultGenerator: providedDefaultGenerator });
    });
    describe('when the key already exists', function () {
      it('returns the existing value', function () {
        expect(defaultMap.get('existingKey')).to.equal('existing value');
        expect(defaultMap.hasGenerator).to.be.true;
        expect(providedDefaultGenerator).to.not.have.been.called();
      });
    });
    describe('when the key does not exist yet', function () {
      describe('with a default generator', function () {
        it('creates an entry using the default generator', function () {
          expect(defaultMap.get('nopeKey')).to.equal('generated value for key: "nopeKey").');
          expect(defaultMap.get('nopeKey')).to.equal('generated value for key: "nopeKey").');
          expect(providedDefaultGenerator).to.have.been.called.once();
        });
      });
      describe('without a default generator', function () {
        describe('with a string as default value', function () {
          var providedDefaultValue = 'default value';
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
          });
          it('generates a value using the default one', function () {
            expect(defaultMap.get('key')).to.equal(providedDefaultValue);
          });
        });
        describe('with a number as default value', function () {
          var providedDefaultValue = 1;
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
          });
          it('generates a value using the default one', function () {
            expect(defaultMap.get('key')).to.equal(providedDefaultValue);
          });
        });
        describe('with an object as default value', function () {
          var providedDefaultValue = { foo: 'bar' };
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
            defaultMap.get('firstKey');
            defaultMap.get('secondKey');
          });
          it('generates values which do not reference the same objects', function () {
            expect(defaultMap.get('firstKey')).to.deep.equal(providedDefaultValue);
            expect(defaultMap.get('firstKey')).to.deep.equal(defaultMap.get('secondKey'));
            defaultMap.get('firstKey').foo = 'changed';
            expect(defaultMap.get('firstKey')).not.to.deep.equal(defaultMap.get('secondKey'));
          });
        });
        describe('with an array as default value', function () {
          var providedDefaultValue = [1];
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
            defaultMap.get('firstKey');
            defaultMap.get('secondKey');
          });
          it('generates values which do not reference the same arrays', function () {
            expect(defaultMap.get('firstKey')).to.deep.equal(providedDefaultValue);
            expect(defaultMap.get('firstKey')).to.deep.equal(defaultMap.get('secondKey'));
            defaultMap.get('firstKey').push(2);
            expect(defaultMap.get('firstKey')).not.to.deep.equal(defaultMap.get('secondKey'));
          });
        });
        describe('with a date as default value', function () {
          var providedDefaultValue = new Date(0);
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
            defaultMap.get('firstKey');
            defaultMap.get('secondKey');
          });
          it('generates values which do not reference the same instances', function () {
            expect(defaultMap.get('firstKey')).to.deep.equal(providedDefaultValue);
            expect(defaultMap.get('firstKey')).to.deep.equal(defaultMap.get('secondKey'));
            defaultMap.get('firstKey').setMinutes(1);
            expect(defaultMap.get('firstKey')).not.to.deep.equal(defaultMap.get('secondKey'));
          });
        });
        describe('with an instance of a custom constructor as default value', function () {
          function FakeConstructor() {}
          var providedDefaultValue = new FakeConstructor();
          before(function () {
            defaultMap = new DefaultMap({ defaultValue: providedDefaultValue });
            defaultMap.get('firstKey');
            defaultMap.get('secondKey');
          });
          it('generates values which do not reference the same instances', function () {
            expect(defaultMap.get('firstKey')).to.deep.equal(providedDefaultValue);
            expect(defaultMap.get('firstKey')).to.deep.equal(defaultMap.get('secondKey'));
            defaultMap.get('firstKey').a = 1;
            expect(defaultMap.get('firstKey')).not.to.deep.equal(defaultMap.get('secondKey'));
          });
          it('preserves the prototype', function () {
            expect(defaultMap.get('key')).to.be.an.instanceof(FakeConstructor);
          });
        });
      });
    });
  });

  describe('#set', function () {
    var defaultMap;
    var providedData = { existingKey: 'existing value' };
    var providedDefaultGenerator = chai.spy(testGenerator);
    before(function () {
      defaultMap = new DefaultMap({ data: providedData, defaultGenerator: providedDefaultGenerator });
    });
    describe('when the key already exists', function () {
      it('erases the existing value', function () {
        defaultMap.set('existingKey', 'new value');
        expect(defaultMap.get('existingKey')).to.equal('new value');
        expect(providedDefaultGenerator).to.not.have.been.called();
      });
    });
    describe('when the key does not exist yet', function () {
      it('creates an entry', function () {
        defaultMap.set('nopeKey', 'new value');
        expect(defaultMap.get('nopeKey')).to.equal('new value');
        expect(providedDefaultGenerator).to.not.have.been.called();
      });
    });
  });

  describe('#has', function () {
    var defaultMap;
    var providedData = { existingKey: 'existing value' };
    var providedDefaultGenerator = chai.spy(testGenerator);
    before(function () {
      defaultMap = new DefaultMap({ data: providedData, defaultGenerator: providedDefaultGenerator });
    });
    describe('when the key exists', function () {
      it('returns true', function () {
        expect(defaultMap.has('existingKey')).to.be.true;
      });
    });
    describe('when the key does not exist', function () {
      it('returns false', function () {
        expect(defaultMap.has('nopeKey')).to.be.false;
      });
    });
    describe('when I just set the key to undefined', function () {
      it('returns true', function () {
        defaultMap.set('newKey', undefined);
        expect(defaultMap.has('newKey')).to.be.true;
      });
    });
    describe('when the key has been deleted', function () {
      it('returns false', function () {
        defaultMap.set('deletedKey', 'I still exist');
        expect(defaultMap.has('deletedKey')).to.be.true;
        defaultMap.delete('deletedKey');
        expect(defaultMap.has('deletedKey')).to.be.false;
      });
    });
  });

  describe('#delete', function () {
    var defaultMap;
    var providedData = { existingKey: 'existing value' };
    describe('when the key exists', function () {
      var providedDefaultGenerator = chai.spy(testGenerator);
      before(function () {
        defaultMap = new DefaultMap({ data: providedData, defaultGenerator: providedDefaultGenerator });
      });
      it('removes it', function () {
        defaultMap.delete('existingKey');
        expect(defaultMap.has('existingKey')).to.be.false;
        expect(providedDefaultGenerator).to.not.have.been.called();
        defaultMap.get('existingKey');
        expect(providedDefaultGenerator).to.have.been.called();
      });
    });
    describe('when the key does not exist', function () {
      var providedDefaultGenerator = chai.spy(testGenerator);
      before(function () {
        defaultMap = new DefaultMap({ data: providedData, defaultGenerator: providedDefaultGenerator });
      });
      it('does not raise an error', function () {
        expect(defaultMap.has('nopeKey')).to.be.false;
        defaultMap.delete('nopeKey');
        expect(defaultMap.has('nopeKey')).to.be.false;
        expect(providedDefaultGenerator).to.not.have.been.called();
        defaultMap.get('nopeKey');
        expect(providedDefaultGenerator).to.have.been.called();
      });
    });
  });

  describe('#forEach', function () {
    var defaultMap;
    describe('when the map contains entries', function () {
      var providedData = { existingKey: 'existing value', dummy: 'value' };
      before(function () {
        defaultMap = new DefaultMap({ data: providedData });
      });
      it('iterates over all the entries', function () {
        var iterator = chai.spy();
        defaultMap.forEach(iterator);
        expect(iterator).to.have.been.called.twice();
        expect(iterator).to.have.been.called.with('existing value', 'existingKey', defaultMap);
        expect(iterator).to.have.been.called.with('value', 'dummy', defaultMap);
      });
      describe('when thisArg is provided', function () {
        var thisArgValue = { thisIs: 'the thisArg value' };
        it("provides it as the function's context", function () {
          var iteratorCalled = false;
          defaultMap.forEach(function () {
            iteratorCalled = true;
            expect(this).to.equal(thisArgValue);
          }, thisArgValue);
          expect(iteratorCalled).to.be.true;
        });
      });
    });
    describe('when the map is empty', function () {
      var providedData = {};
      before(function () {
        defaultMap = new DefaultMap({ data: providedData });
      });
      var iterator = chai.spy();
      it('does not call the provided iterator', function () {
        defaultMap.forEach(iterator);
        expect(iterator).to.not.have.been.called();
      });
    });
  });

  describe('#isEmpty', function () {
    var defaultMap;
    describe('when the map does not contain any entry', function () {
      before(function () {
        defaultMap = new DefaultMap();
      });
      it('returns true', function () {
        expect(defaultMap.isEmpty()).to.be.true;
      });
    });
    describe('when the map contains entries', function () {
      var providedData = { existingKey: 'existing value', dummy: 'value' };
      before(function () {
        defaultMap = new DefaultMap({ data: providedData });
      });
      it('returns false', function () {
        expect(defaultMap.isEmpty()).to.be.false;
      });
    });
    describe('when the existing entry has just been deleted', function () {
      var providedData = { existingKey: 'existing value' };
      before(function () {
        defaultMap = new DefaultMap({ data: providedData });
        defaultMap.delete('existingKey');
      });
      it('returns true', function () {
        expect(defaultMap.isEmpty()).to.be.true;
      });
    });
  });
});
