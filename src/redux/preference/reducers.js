import actions from "./actions";
const {
  PREFERENCE_ADD,
  PREFERENCE_ADD_ERR,
  PREFERENCE_LIST,
  PREFERENCE_LIST_ERR,
  PREFERENCE_ID,
  PREFERENCE_ID_ERR,
  IS_DARK_MODE,
} = actions;

const initialState = {
  PreferenceList: [],
  isDark: false,
  PreferenceIdData: {},
};

const preferenceReducer = (state = initialState, action) => {
  const {
    type,
    err,
    PreferenceData,
    PreferenceList,
    PreferenceIdData,
    isDark,
  } = action;
  switch (type) {
    case PREFERENCE_ADD:
      return {
        ...state,
        PreferenceData,
        isDark: PreferenceData.selling_preferences.dark_mode,
      };
    case PREFERENCE_ADD_ERR:
      return {
        ...state,
        err,
      };

    case PREFERENCE_LIST:
      return {
        ...state,
        PreferenceList,
      };
    case PREFERENCE_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PREFERENCE_ID:
      return {
        ...state,
        PreferenceIdData,
        isDark: PreferenceIdData.selling_preferences.dark_mode,
      };
    case PREFERENCE_ID_ERR:
      return {
        ...state,
        err,
      };
    case IS_DARK_MODE:
      return {
        ...state,
        isDark,
      };

    default:
      return state;
  }
};
export { preferenceReducer };
