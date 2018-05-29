import fp from 'mostly-func';
import parseVariables from './parse-variables';

export default function getAllVariables (variables = {}, defaults){
  const values = parseVariables(defaults);
  return fp.merge(variables, values);
}
