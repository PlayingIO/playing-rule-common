const assert = require('assert');
const fp = require('mostly-func');
const { helpers } = require('mostly-feathers-mongoose');
const getMetricRules = require('../get-metric-rules');

const getRequiresField = (target) => fp.reduce((arr, item) => {
  arr.push(helpers.getField(item, target) || []);
  return arr;
}, []);

module.exports = function populateRequires (target, getRequires) {
  return async function (context) {
    assert(context.type === 'after', `populateRequires must be used as a 'after' hook.`);

    let data = helpers.getHookDataAsArray(context);

    // target must be specified by $select to populate
    if (!helpers.isSelected(target, context.params)) return context;

    // gether all requires in rules, as array of conditions array
    const getRequiresFunc = getRequires || getRequiresField(target);
    const requires = fp.reject(fp.isEmpty, getRequiresFunc(data));
    const metricRules = fp.flatMap(getMetricRules, requires);
    await helpers.populateByService(context.app, 'metric', 'type')(metricRules);

    return context;
  };
};