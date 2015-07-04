var chai = require('chai');
var spies = require('chai-spies');

chai.config.includeStack = true;
chai.use(spies);

global.chai = chai;
global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
