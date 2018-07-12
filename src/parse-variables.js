const fp = require('mostly-func');

module.exports = function parseVariables (variables) {
  return fp.reduce((obj, v) => {
    switch (v.type) {
      case 'Number': obj[v.name] = v; break;
      case 'String': obj[v.name] = parseInt(v); break;
    }
    return obj;
  }, {}, variables);
};