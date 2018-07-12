const fp = require('mostly-func');
const parseVariables = require('./parse-variables');

module.exports = function getAllVariables (variables = {}, defaults){
  const values = parseVariables(defaults);
  return fp.merge(variables, values);
};