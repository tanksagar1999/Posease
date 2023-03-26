const actions = {
  PREFERENCE_ADD: "PREFERENCE_ADD",
  PREFERENCE_ADD_ERR: "PREFERENCE_ADD_ERR",
  PREFERENCE_LIST: "PREFERENCE_LIST",
  PREFERENCE_LIST_ERR: "PREFERENCE_LIST_ERR",
  PREFERENCE_ID: "PREFERENCE_ID",
  IS_DARK_MODE: "IS_DARK_MODE",
  PREFERENCE_ID_ERR: "PREFERENCE_ID_ERR",

  PreferenceAdd: (PreferenceData) => {
    return {
      type: actions.PREFERENCE_ADD,
      error: false,
      PreferenceData,
    };
  },
  isDarkMode: (isDark) => {
    return {
      type: actions.IS_DARK_MODE,
      isDark,
    };
  },

  PreferenceAddErr: (err) => {
    return {
      type: actions.PREFERENCE_ADD_ERR,
      error: true,
      err,
    };
  },

  PreferenceList: (PreferenceList) => {
    return {
      type: actions.PREFERENCE_LIST,
      PreferenceList,
    };
  },
  PreferenceListErr: (err) => {
    return {
      type: actions.Preference_LIST_ERR,
      err,
    };
  },
  PreferenceId: (PreferenceIdData) => {
    return {
      type: actions.PREFERENCE_ID,
      PreferenceIdData,
    };
  },
  PreferenceIdErr: (err) => {
    return {
      type: actions.PREFERENCE_ID_ERR,
      err,
    };
  },
};

export default actions;
