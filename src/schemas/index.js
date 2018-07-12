const { rate, limit } = require('./rate.schema');
const { requires } = require('./requires.schema');
const { reward } = require('./reward.schema');
const { variable } = require('./variable.schema');

module.exports = {
  rate: { schema: rate },
  limit: { schema: limit },
  requires: { schema: requires },
  rewards: { schema: [reward] },
  variables: { schema: [variable] }
};
