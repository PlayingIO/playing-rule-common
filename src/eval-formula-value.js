import fp from 'mostly-func';
import nerdamer from 'nerdamer';

export default function evalFormulaValue (value, variables = {}) {
  const result = nerdamer(value, fp.clone(variables)).evaluate(); // clone as nerdamer will change vars
  return parseInt(result.text());
}
