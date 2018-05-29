import fp from 'mostly-func';

export default function getMetricRules (conditions) {
  return fp.flatten(fp.reduce((arr, cond) => {
    if (cond.rule === 'metric') arr = arr.concat(cond);
    if (cond.rule === 'and' || cond.rule === 'or') {
      arr = arr.concat(fp.flatten(getMetricRules(cond.conditions || [])));
    }
    return arr;
  }, [], conditions));
}
