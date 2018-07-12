const assert = require('assert');
const fp = require('mostly-func');
const { helpers } = require('mostly-feathers-mongoose');

const getRewardsField = (target) => fp.reduce((arr, item) => {
  return arr.concat(helpers.getField(item, target));
}, []);

module.exports = function populateRewards (target, getRewards) {
  return async function (context) {
    assert(context.type === 'after', `populateRewards must be used as a 'after' hook.`);

    let data = helpers.getHookDataAsArray(context);

    // target must be specified by $select to assoc
    if (!helpers.isSelected(target, context.params)) return context;

    // gether all rewards
    const getRewardsFunc = getRewards || getRewardsField(target);
    const metricRewards = fp.reject(fp.isNil, getRewardsFunc(data));
    await helpers.populateByService(context.app, 'metric', 'type')(metricRewards);

    return context;
  };
}