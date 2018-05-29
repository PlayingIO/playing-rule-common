import { rate, limit } from './rate.schema';
import { requires } from './requires.schema';
import { reward } from './reward.schema';
import { variable } from './variable.schema';

export default {
  rate: { schema: rate },
  limit: { schema: limit },
  requires: { schema: requires },
  rewards: { schema: [reward] },
  variables: { schema: [variable] }
};
