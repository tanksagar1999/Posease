import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");
const {
  PreferenceAdd,
  PreferenceAddErr,
  isDarkMode,
  PreferenceId,
  PreferenceIdErr,
} = actions;

const addOrUpdatePrefernce = (formData) => {
  return async (dispatch) => {
    try {
      let getAddedPrefernce = {};
      getAddedPrefernce = await DataService.post(
        API.prefernce.addPrefernce,
        formData
      );
      if (!getAddedPrefernce.data.error) {
        return dispatch(PreferenceAdd(getAddedPrefernce.data.data));
      } else {
        return dispatch(PreferenceAddErr(getAddedPrefernce.data.data));
      }
    } catch (err) {
      dispatch(PreferenceAddErr(err));
    }
  };
};
const getPrefernceById = (id) => {
  return async (dispatch) => {
    try {
      const PreferenceByIdData = await DataService.get(
        `${API.prefernce.getPreferenceById}/${id}`
      );
      if (!PreferenceByIdData.data.error) {
        return dispatch(PreferenceId(PreferenceByIdData.data.data));
      } else {
        return dispatch(PreferenceIdErr(PreferenceByIdData.data));
      }
    } catch (err) {
      dispatch(PreferenceIdErr(err));
    }
  };
};
const DarkModeAvailable = (value) => {
  return async (dispatch) => {
    return dispatch(isDarkMode(value));
  };
};

export { addOrUpdatePrefernce, getPrefernceById, DarkModeAvailable };
