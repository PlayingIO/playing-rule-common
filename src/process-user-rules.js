// trigger all rules
module.exports = function processUserRules (app) {
  const svcUserRules = app.service('user-rules');
  return async (user) => {
    return svcUserRules.create({ user: user.id }, { user });
  };
};