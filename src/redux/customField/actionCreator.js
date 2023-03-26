import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  CustomFieldAdd,
  CustomFieldAddErr,
  CustomFieldId,
  CustomFieldIdErr,
  CustomFieldDelete,
  CustomFieldDeleteErr,
  PattyCashList,
  PattyCashListErr,
  PaymnetTypeList,
  PaymnetTypeListErr,
  AddtionalList,
  AddtionalListErr,
  TagList,
  TagListErr,
} = actions;

const addOrUpdateCustomField = (formData, CustomField_id) => {
  return async (dispatch) => {
    try {
      let getAddedCustomField = {};
      if (CustomField_id) {
        getAddedCustomField = await DataService.put(
          `${API.customField.addCustomField}/${CustomField_id}`,
          formData
        );
      } else {
        getAddedCustomField = await DataService.post(
          API.customField.addCustomField,
          formData
        );
      }
      if (!getAddedCustomField.data.error) {
        return dispatch(CustomFieldAdd(getAddedCustomField.data.data));
      } else {
        return dispatch(CustomFieldAddErr(getAddedCustomField.data.data));
      }
    } catch (err) {
      dispatch(CustomFieldAddErr(err));
    }
  };
};

const getAllPattyCashList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.customFields != undefined &&
        allSetupcache.customFields.patty_cash != undefined &&
        allSetupcache.customFields.patty_cash.length &&
        checkSell == "sell"
      ) {
        return dispatch(PattyCashList(allSetupcache.customFields.patty_cash));
      } else {
        const getPattyCashList = await DataService.get(
          API.customField.getAllPattyCash
        );
        if (!getPattyCashList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.customFields.patty_cash = getPattyCashList.data.data;
          setItem("setupCache", allSetupcache);

          return dispatch(PattyCashList(getPattyCashList.data.data));
        } else {
          return dispatch(PattyCashListErr(getPattyCashList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.customFields.patty_cash) {
        return dispatch(PattyCashList(allSetupcache.customFields.patty_cash));
      } else {
        return dispatch(PattyCashListErr(err));
      }
    }
  };
};
const getAllAddtionalList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.customFields != undefined &&
        allSetupcache.customFields.addtional != undefined &&
        allSetupcache.customFields.addtional.length &&
        checkSell == "sell"
      ) {
        return dispatch(AddtionalList(allSetupcache.customFields.addtional));
      } else {
        const getAddtionalList = await DataService.get(
          API.customField.getAllAddtional
        );
        if (!getAddtionalList.data.error) {
          allSetupcache.customFields.addtional = getAddtionalList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(AddtionalList(getAddtionalList.data.data));
        } else {
          return dispatch(AddtionalListErr(getAddtionalList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.customFields.addtional) {
        return dispatch(AddtionalList(allSetupcache.customFields.addtional));
      } else {
        return dispatch(AddtionalListErr(err));
      }
    }
  };
};

const getAllPaymentTypeList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.customFields != undefined &&
        allSetupcache.customFields.paymnetType != undefined &&
        allSetupcache.customFields.paymnetType.length &&
        checksell == "sell"
      ) {
        return dispatch(
          PaymnetTypeList(allSetupcache.customFields.paymnetType)
        );
      } else {
        const getPaymnetTypeList = await DataService.get(
          API.customField.getAllPaymentType
        );
        if (!getPaymnetTypeList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.customFields.paymnetType = getPaymnetTypeList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(PaymnetTypeList(getPaymnetTypeList.data.data));
        } else {
          return dispatch(PaymnetTypeListErr(getPaymnetTypeList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.customFields.paymnetType) {
        return dispatch(
          PaymnetTypeList(allSetupcache.customFields.paymnetType)
        );
      } else {
        return dispatch(PaymnetTypeListErr(err));
      }
    }
  };
};

const getCutomeFieldById = (id, type) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let customFieldDetails;
      if (
        allSetupcache?.customFields &&
        type == "payment_type" &&
        allSetupcache?.customFields.paymnetType
      ) {
        customFieldDetails = allSetupcache?.customFields.paymnetType.find(
          (i) => i._id == id
        );
      } else if (
        allSetupcache?.customFields &&
        type == "petty_cash_category" &&
        allSetupcache?.customFields.patty_cash
      ) {
        customFieldDetails = allSetupcache?.customFields.patty_cash.find(
          (i) => i._id == id
        );
      } else if (
        allSetupcache?.customFields &&
        type == "additional_detail" &&
        allSetupcache?.customFields.addtional
      ) {
        customFieldDetails = allSetupcache?.customFields.addtional.find(
          (i) => i._id == id
        );
      } else if (
        allSetupcache?.customFields &&
        type == "tag" &&
        allSetupcache?.customFields.tag
      ) {
        customFieldDetails = allSetupcache?.customFields.tag.find(
          (i) => i._id == id
        );
      }

      if (customFieldDetails) {
        return dispatch(CustomFieldId(customFieldDetails));
      } else {
        const CustomFieldByIdData = await DataService.get(
          `${API.customField.getCustomFieldById}/${id}`
        );
        if (!CustomFieldByIdData.data.error) {
          return dispatch(CustomFieldId(CustomFieldByIdData.data.data));
        } else {
          return dispatch(CustomFieldIdErr(CustomFieldByIdData.data));
        }
      }
    } catch (err) {
      dispatch(CustomFieldIdErr(err));
    }
  };
};

const deleteCustomField = (CustomFieldIds) => {
  return async (dispatch) => {
    try {
      const getDeletedCustomField = await DataService.post(
        API.customField.deleteAllCustomField,
        CustomFieldIds
      );

      if (!getDeletedCustomField.data.error) {
        return dispatch(CustomFieldDelete(getDeletedCustomField.data));
      } else {
        return dispatch(CustomFieldDeleteErr(getDeletedCustomField.data));
      }
    } catch (err) {
      dispatch(CustomFieldDeleteErr(err));
    }
  };
};
const getAllTagList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache &&
        allSetupcache?.customFields?.tag &&
        checksell == "sell"
      ) {
        return dispatch(TagList(allSetupcache.customFields.tag));
      } else {
        const getTagList = await DataService.get(API.customField.getAllTag);
        if (!getTagList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.customFields.tag = getTagList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(TagList(getTagList.data.data));
        } else {
          return dispatch(TagListErr(getTagList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.customFields.tag) {
        return dispatch(TagList(allSetupcache.customFields.tag));
      } else {
        return dispatch(TagListErr(err));
      }
    }
  };
};

export {
  addOrUpdateCustomField,
  getCutomeFieldById,
  deleteCustomField,
  getAllPattyCashList,
  getAllPaymentTypeList,
  getAllAddtionalList,
  getAllTagList,
};
