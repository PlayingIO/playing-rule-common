import fp from 'mostly-func';

export default function parseVariables (variables) {
  return fp.reduce((obj, v) => {
    switch (v.type) {
      case 'Number': obj[v.name] = v.default; break;
      case 'String': obj[v.name] = parseInt(v.default); break;
    }
    return obj;
  }, {}, variables);
}
