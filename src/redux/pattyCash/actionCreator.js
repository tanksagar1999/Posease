import { getItem, setItem } from "../../utility/localStorageControl";
import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  searchHeaderBegin,
  searchHeaderSuccess,
  searchHeaderErr,
  PattyAdd,
  PattyAddErr,
  PattyList,
  PattyListErr,
  PattyDelete,
  PattyDeleteErr,
  filterDateList,
} = actions;

const headerGlobalSearchAction = (searchData) => {
  return (dispatch) => {
    try {
      dispatch(searchHeaderBegin());
      dispatch(searchHeaderSuccess(searchData));
    } catch (err) {
      dispatch(searchHeaderErr(err));
    }
  };
};
const addOrUpdatePatty = (formData, PattyId) => {
  return async (dispatch) => {
    try {
      formData.register_id = getItem("setupCache").register.find(
        (val) => val.active
      )._id;
      formData.actual_time = new Date();

      let getAddedPatty = {};
      if (PattyId) {
        getAddedPatty = await DataService.put(
          `${API.pattyCash.addPatty}/${PattyId}`,
          formData
        );
      } else {
        getAddedPatty = await DataService.post(
          API.pattyCash.addPatty,
          formData
        );
      }

      if (!getAddedPatty.data.error) {
        return dispatch(PattyAdd(getAddedPatty.data.data));
      } else {
        return dispatch(PattyAddErr(getAddedPatty.data.data));
      }
    } catch (err) {
      let pendingPattycashList = getItem("pendingPattyCashEntries");
      setItem("pendingPattyCashEntries", [...pendingPattycashList, formData]);
      return dispatch(PattyAdd(formData));
    }
  };
};
const getAllPattyList = (current_page, limit) => {
  return async (dispatch) => {
    try {
      const getPattyList = await DataService.get(
        `${API.pattyCash.getAllPatty
        }?page=${current_page}&limit=${limit}&register_id=${getItem("setupCache").register.find((val) => val.active)._id
        }`
      );
      if (!getPattyList.data.error) {
        let filterData = getPattyList.data.data.filter(
          (val) =>
            val.register_id._id ==
            getItem("setupCache").register.find((val) => val.active)._id
        );

        return dispatch(
          PattyList(
            getPattyList.data.data,
            getPattyList.data.pagination.total_counts
          )
        );
      } else {
        return dispatch(PattyListErr(getPattyList.data));
      }
    } catch (err) {
      dispatch(PattyListErr(err));
    }
  };
};

export const ExportPatty = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.pattyCash.exportOfPatty, payloads);
    return resp.data
  };
};

const deletePatty = (PattyIds) => {
  return async (dispatch) => {
    try {
      const getDeletedPatty = await DataService.delete(
        `${API.pattyCash.deletePatty}/${PattyIds}`
      );
      if (!getDeletedPatty.data.error) {
        return dispatch(PattyDelete(getDeletedPatty.data));
      } else {
        return dispatch(PattyDeleteErr(getDeletedPatty.data));
      }
    } catch (err) {
      dispatch(PattyDeleteErr(err));
    }
  };
};

const getDateList = (start, end) => {
  return async (dispatch) => {
    dispatch(filterDateList(start, end));
  };
};

export {
  headerGlobalSearchAction,
  addOrUpdatePatty,
  getAllPattyList,
  getDateList,
  deletePatty,
};
