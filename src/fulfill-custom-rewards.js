import fp from 'mostly-func';
import { fulfillRequire } from './fulfill-requires';

export default function fulfillCustomRewards (rules, variables, user) {
  // filter by the rule requirements
  const activeRules = fp.filter(rule => {
    return fp.all(fulfillRequire(user, variables), rule.requires);
  }, rules);
  return fp.flatMap(fp.prop('rewards'), activeRules);
}