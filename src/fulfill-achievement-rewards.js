import fp from 'mostly-func';
import { fulfillRequire } from './fulfill-requires';

export default function fulfillAchievementRewards (achievement, variables, user) {
  return fp.reduce((arr, rule) => {
    if (rule.item && rule.item.name && rule.item.number) {
      if (fulfillRequire(user, variables, rule.requires)) {
        const reward = {
          metric: achievement.metric,
          item: rule.item.name,
          verb: 'add',
          value: rule.item.number
        };
        return fp.concat(arr, [reward]);
      }
    } else {
      console.warn('process achievement rule skipped:', rule);
    }
    return arr;
  }, [], achievement.rules || []);
}
