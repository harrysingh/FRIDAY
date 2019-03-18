const _ = require('underscore');
const { User } = require('../models/index');
const authService = require('../services/auth.service');
const DVUtils = require('../../shared/utils');
const { to, reE, reS } = require('../services/util.service');

const create = async(req, res) => {
  res.setHeader('Content-Type', 'application/json');
  // eslint-disable-next-line prefer-destructuring
  const body = req.body;
  if (!body.unique_key && !body.email && !body.phone) {
    return reE(res, 'Please enter an email or phone number to register.');
  } if (!body.password) {
    return reE(res, 'Please enter a password to register.');
  }

  const [ err, user ] = await to(authService.createUser(body));
  if (err) {
    return reE(res, err, 422);
  }
  return reS(res, { message: 'Successfully created new user.', user: user.toWeb(), token: user.getJWT() }, 201);
};

const getAll = async(req, res) => {
  const [ err, users ] = await to(User.find());

  if (err) {
    return reE(res, 'error occurred trying to list user');
  }

  return reS(res, {
    items: users,
    total: _.size(users),
  });
};

const get = async(req, res) => {
  const currentUser = req.user;
  if (!DVUtils.isUserAdmin(currentUser) || currentUser.id !== req.params.id) {
    return reE(res, `User ${ currentUser.id } does not has access to query user ${ req.params.id }`);
  }

  const [ error, userArray ] = await to(User.find({ _id: req.params.id }));
  if (error || _.size(userArray) === 0) {
    return reE(res, 'Invalid User to query');
  }

  res.setHeader('Content-Type', 'application/json');
  return reS(res, { user: userArray[0].toWeb() });
};

const update = async(req, res) => {
  const currentUser = req.user;
  if (!DVUtils.isUserAdmin(currentUser)) {
    return reE(res, 'Only admins can update Users');
  }

  const [ error, userArray ] = await to(User.find({ _id: req.params.id }));
  if (error || _.size(userArray) === 0) {
    return reE(res, 'Invalid User to update');
  }

  let user = userArray[0];
  user.set(req.body);

  let err;
  [ err, user ] = await to(user.save());
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err, user);

    if (err.message.includes('E11000')) {
      if (err.message.includes('phone')) {
        err = 'This phone number is already in use';
      } else if (err.message.includes('email')) {
        err = 'This email address is already in use';
      } else {
        err = 'Duplicate Key Entry';
      }
    }

    return reE(res, err);
  }

  return reS(res, { message: `Updated User: ${ user.email }` });
};

const getSettings = async(req, res) => {
  const currentUser = req.user;

  const [ error, userArray ] = await to(User.find({ _id: currentUser.id }));
  if (error || _.size(userArray) === 0) {
    return reE(res, 'Invalid User to get settings');
  }

  return reS(res, { settings: userArray[0].settings });
};

const updateSettings = async(req, res) => {
  const currentUser = req.user;

  const [ error, userArray ] = await to(User.find({ _id: currentUser.id }));
  if (error || _.size(userArray) === 0) {
    return reE(res, 'Invalid User to update settings');
  }

  const user = userArray[0];
  const settings = _.extend(user.settings, req.body.settings);
  user.set({ settings });

  const [ err, updatedUser ] = await to(user.save());
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err, user);
    return reE(res, err);
  }

  return reS(res, { message: `Updated User settings: ${ updatedUser.email }`, settings: updatedUser.settings });
};

const remove = async(req, res) => {
  const [ err ] = await to(req.user.destroy());
  if (err) {
    return reE(res, 'error occured trying to delete user');
  }

  return reS(res, { message: 'Deleted User' }, 204);
};

const login = async(req, res) => {
  const [ err, user ] = await to(authService.authUser(req.body));
  if (err) {
    return reE(res, err, 422);
  }

  res.cookie(DVUtils.FRIDAY_USER_PROFILE_KEY, JSON.stringify({
    id: user.id,
    name: { first: user.first, last: user.last },
    email: user.email,
    role: user.role,
  }), { expire: 9999 });
  res.cookie(DVUtils.FRIDAY_AUTH_TOKEN_KEY, user.getJWT(), { expire: 9999 });
  return reS(res, { token: user.getJWT(), user: user.toWeb() });
};

const logout = (req, res) => {
  if (_.isEmpty(req.cookies[DVUtils.FRIDAY_AUTH_TOKEN_KEY])) {
    return reE(res, 'User no logged in', 422);
  }

  res.cookie(DVUtils.FRIDAY_USER_PROFILE_KEY, DVUtils.EMPTY_STRING, { maxAge: 9999 });
  res.cookie(DVUtils.FRIDAY_AUTH_TOKEN_KEY, DVUtils.EMPTY_STRING, { maxAge: 9999 });
  return reS(res);
};

module.exports = {
  create,
  get,
  getAll,
  getSettings,
  update,
  updateSettings,
  remove,
  login,
  logout,
};
