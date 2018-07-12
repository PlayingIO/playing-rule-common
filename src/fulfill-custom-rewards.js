const fp = require('mostly-func');
const fulfillRequire = require('./fulfill-require');

module.exports = function fulfillCustomRewards (rules, variables, user) {
  // filter by the rule requirements
  const activeRules = fp.filter(rule => {
    return fp.all(fulfillRequire(user, variables), rule.requires);
  }, rules);
  return fp.flatMap(fp.prop('rewards'), activeRules);
};