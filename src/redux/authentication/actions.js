const actions = {
  LOGIN_BEGIN: "LOGIN_BEGIN",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  FORGOT_PIN_ADD: "FORGOT_PIN_ADD",
  FORGOT_PIN_ADD_ERR: "FORGOT_PIN_ADD_ERR",
  LOGIN_ROLE: "LOGIN_ROLE",
  LOGIN_ERR: "LOGIN_ERR",
  IS_ADMIN: "IS_ADMIN",
  LOGOUT_BEGIN: "LOGOUT_BEGIN",
  LOGOUT_SUCCESS: "LOGOUT_SUCCESS",
  LOGOUT_ERR: "LOGOUT_ERR",
  RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
  REGISTER_BEGIN: "REGISTER_BEGIN",
  REGISTER_ERR: "REGISTER_ERR",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  OFFLINE_MODE: "OFFLINE_MODE",
  LOCAL_TABLE_ARRAY: "LOCAL_TABLE_ARRAY",
  ADD_WAITER_DATA: "ADD_WAITER_DATA",
  REMOVE_WAITER_DATA: "REMOVE_WAITER_DATA",

  registerBegin: () => {
    return {
      type: actions.REGISTER_BEGIN,
    };
  },

  registerSuccess: (data) => {
    return {
      type: actions.REGISTER_SUCCESS,
      data,
    };
  },

  loginBegin: () => {
    return {
      type: actions.LOGIN_BEGIN,
    };
  },

  loginSuccess: (data) => {
    return {
      type: actions.LOGIN_SUCCESS,
      data,
    };
  },
  SetRole: (data) => {
    return {
      type: actions.IS_ADMIN,
      data,
    };
  },
  loginErr: (err) => {
    return {
      type: actions.LOGIN_ERR,
      err,
    };
  },

  registerErr: (err) => {
    return {
      type: actions.REGISTER_ERR,
      err,
    };
  },

  logoutBegin: () => {
    return {
      type: actions.LOGOUT_BEGIN,
    };
  },

  logoutSuccess: (data) => {
    return {
      type: actions.LOGOUT_SUCCESS,
      data,
    };
  },

  logoutErr: (err) => {
    return {
      type: actions.LOGOUT_ERR,
      err,
    };
  },

  resetPasswordSuccess: (data) => {
    return {
      type: actions.RESET_PASSWORD_SUCCESS,
      data,
    };
  },
  ForgotpinAdd: (ForgotPinData) => {
    return {
      type: actions.FORGOT_PIN_ADD,
      ForgotPinData,
    };
  },

  ForgotpinAddErr: (err) => {
    return {
      type: actions.FORGOT_PIN_ADD_ERR,
      err,
    };
  },
  LocalTableArray: (localTableData) => {
    return {
      type: actions.LOCAL_TABLE_ARRAY,
      localTableData,
    };
  },
  AddWaiterTableData: (addWaiterData) => {
    return {
      type: actions.ADD_WAITER_DATA,
      addWaiterData,
    };
  },
  RemoveWaiterData: (removeWaiterData) => {
    return {
      type: actions.REMOVE_WAITER_DATA,
      removeWaiterData,
    };
  },
  offlineModeValue: (value) => {
    return {
      type: actions.OFFLINE_MODE,
      offlineYaOnline: value,
    };
  },
};

export default actions;
