const DVEnums = {
  CLOSENESS: Object.freeze({
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  }),

  LOG_LEVEL: Object.freeze({
    INFO: 'info',
    DEBUG: 'debug',
  }),

  REQ_RESULT: Object.freeze({
    INITIALIZED: 'INITIALIZED',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
  }),

  USER_ROLES: Object.freeze({
    NON_ADMIN: 0,
    ADMIN: 1,
  }),

};

module.exports = DVEnums;
