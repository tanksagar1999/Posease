import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  DiscountRulesAdd,
  DiscountRulesAddErr,
  DiscountRulesList,
  DiscountRulesListErr,
  DiscountRulesId,
  DiscountRulesIdErr,
  DiscountRulesDelete,
  DiscountRulesDeleteErr,
} = actions;

const addOrUpdateDiscountRules = (formData, DiscountRules_id) => {
  return async (dispatch) => {
    try {
      let getAddedDiscountRules = {};
      if (DiscountRules_id) {
        getAddedDiscountRules = await DataService.put(
          `${API.discountRules.addDiscountRules}/${DiscountRules_id}`,
          formData
        );
      } else {
        getAddedDiscountRules = await DataService.post(
          API.discountRules.addDiscountRules,
          formData
        );
      }
      if (!getAddedDiscountRules.data.error) {
        return dispatch(DiscountRulesAdd(getAddedDiscountRules.data.data));
      } else {
        return dispatch(DiscountRulesAddErr(getAddedDiscountRules.data.data));
      }
    } catch (err) {
      dispatch(DiscountRulesAddErr(err));
    }
  };
};

const getAllDiscountRulesList = (checkSellModule) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.discountRules != undefined &&
        allSetupcache.discountRules.length &&
        checkSellModule == "sell"
      ) {
        return dispatch(DiscountRulesList(allSetupcache.discountRules));
      } else {
        const getDiscountRulesList = await DataService.get(
          API.discountRules.getAlldiscountRules
        );
        if (!getDiscountRulesList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.discountRules = getDiscountRulesList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(DiscountRulesList(getDiscountRulesList.data.data));
        } else {
          return dispatch(DiscountRulesListErr(getDiscountRulesList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.discountRules) {
        return dispatch(DiscountRulesList(allSetupcache.discountRules));
      } else {
        return dispatch(DiscountRulesListErr(err));
      }
    }
  };
};

const getDiscountRulesById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache != null && allSetupcache.discountRules) {
        discountRulesDetails = allSetupcache.discountRules.find(
          (val) => val._id == id
        );
      }

      const DiscountRulesByIdData = await DataService.get(
        `${API.discountRules.getDiscountRulesById}/${id}`
      );
      if (!DiscountRulesByIdData.data.error) {
        return dispatch(DiscountRulesId(DiscountRulesByIdData.data.data));
      } else {
        return dispatch(DiscountRulesIdErr(DiscountRulesByIdData.data));
      }
    } catch (err) {
      dispatch(DiscountRulesIdErr(err));
    }
  };
};

const deleteDiscountRules = (DiscountRulesIds) => {
  return async (dispatch) => {
    try {
      const getDeletedDiscountRules = await DataService.post(
        API.discountRules.deleteAllDiscountRules,
        DiscountRulesIds
      );
      if (!getDeletedDiscountRules.data.error) {
        return dispatch(DiscountRulesDelete(getDeletedDiscountRules.data));
      } else {
        return dispatch(DiscountRulesDeleteErr(getDeletedDiscountRules.data));
      }
    } catch (err) {
      dispatch(DiscountRulesDeleteErr(err));
    }
  };
};
export {
  addOrUpdateDiscountRules,
  getAllDiscountRulesList,
  getDiscountRulesById,
  deleteDiscountRules,
};
