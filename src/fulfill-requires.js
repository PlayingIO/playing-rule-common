const fp = require('mostly-func');
const fulfillRequire = require('./fulfill-require');

module.exports = function fulfillRequires (user, variables, requires) {
  return requires && fp.all(fulfillRequire(user, variables), requires);
};