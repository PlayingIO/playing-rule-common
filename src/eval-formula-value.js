const fp = require('mostly-func');
const nerdamer = require('nerdamer');

module.exports = function evalFormulaValue (value, variables = {}) {
  const result = nerdamer(value, fp.clone(variables)).evaluate(); // clone as nerdamer will change vars
  return parseInt(result.text());
};