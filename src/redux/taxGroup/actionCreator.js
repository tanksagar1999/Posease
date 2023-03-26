import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  taxGroupList,
  taxGroupListErr,
  taxName,
  taxNameErr,
  taxGroupAdd,
  taxGroupId,
  taxGroupIdErr,
  taxGroupDelete,
  taxGroupDeleteErr,
} = actions;

const getTaxGroupList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.taxGroups != undefined &&
        allSetupcache.taxGroups.length &&
        checksell == "sell"
      ) {
        return dispatch(taxGroupList(allSetupcache.taxGroups));
      } else {
        const groupList = await DataService.get(API.taxGroup.getAllTaxGroup);

        if (!groupList.data.error) {
          allSetupcache.taxGroups = groupList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(taxGroupList(groupList.data.data));
        } else {
          return dispatch(taxGroupListErr(groupList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      return dispatch(taxGroupList(allSetupcache.taxGroups));
    }
  };
};

const getAllTaxNameList = () => {
  return async (dispatch) => {
    try {
      const getTaxName = await DataService.get(API.taxGroup.getTaxName);
      if (!getTaxName.data.error) {
        return dispatch(taxName(getTaxName.data.data));
      } else {
        return dispatch(taxNameErr(getTaxName.data));
      }
    } catch (err) {
      dispatch(taxNameErr(err));
    }
  };
};

const addOrUpdateTaxesGroup = (formData, TaxesGroup_id) => {
  return async (dispatch) => {
    try {
      let getAddedTaxesGroup = {};
      if (TaxesGroup_id) {
        getAddedTaxesGroup = await DataService.put(
          `${API.taxGroup.addTaxGroup}/${TaxesGroup_id}`,
          formData
        );
        if (getAddedTaxesGroup.data.data) {
          let allSetupcache = getItem("setupCache");
          let allProductList = getItem("productList");
          let localtaxlist = allSetupcache.taxes;
          let taxdata = [];
          getAddedTaxesGroup.data.data.taxes &&
            getAddedTaxesGroup.data.data.taxes.length > 0 &&
            getAddedTaxesGroup.data.data.taxes.map((val) => {
              taxdata = [...taxdata, localtaxlist.find((j) => j._id == val)];
            });
          getAddedTaxesGroup.data.data.taxes = taxdata;

          allProductList &&
            allProductList.length > 0 &&
            allProductList.map((val) => {
              if (
                val?.tax_group &&
                val.tax_group._id == getAddedTaxesGroup.data.data._id
              ) {
                val.tax_group.taxes = getAddedTaxesGroup.data.data.taxes;
                val.tax_group.tax_group_name =
                  getAddedTaxesGroup.data.data.tax_group_name;
                val.tax_group.taxes_inclusive_in_product_price =
                  getAddedTaxesGroup.data.data.taxes_inclusive_in_product_price;
              }
            });

          setItem("setupCache", allSetupcache);
          setItem("productList", allProductList);
        }
      } else {
        getAddedTaxesGroup = await DataService.post(
          API.taxGroup.addTaxGroup,
          formData
        );
      }
      if (!getAddedTaxesGroup.data.error) {
        return dispatch(taxGroupAdd(getAddedTaxesGroup.data.data));
      } else {
        return dispatch(taxGroupAdd(getAddedTaxesGroup.data.data));
      }
    } catch (err) {
      dispatch(taxGroupAdd(err));
    }
  };
};

const getTaxGroupById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let taxGroupsDetails;
      if (allSetupcache != null && allSetupcache.taxes) {
        taxGroupsDetails = allSetupcache.taxGroups.find((val) => val._id == id);
      }
      if (taxGroupsDetails) {
        let data = taxGroupsDetails.taxes.map((val) => val._id);
        taxGroupsDetails.taxes = data;
        return dispatch(taxGroupId(taxGroupsDetails));
      } else {
        const TaxGroupByIdData = await DataService.get(
          `${API.taxGroup.getTaxesById}/${id}`
        );
        if (!TaxGroupByIdData.data.error) {
          return dispatch(taxGroupId(TaxGroupByIdData.data.data));
        } else {
          return dispatch(taxGroupIdErr(TaxGroupByIdData.data));
        }
      }
    } catch (err) {
      dispatch(taxGroupIdErr(err));
    }
  };
};
const deleteTaxGroup = (TaxGroupIds) => {
  return async (dispatch) => {
    try {
      const getDeletedTaxGroup = await DataService.post(
        API.taxGroup.deleteAllTaxGroup,
        TaxGroupIds
      );

      if (!getDeletedTaxGroup.data.error) {
        return dispatch(taxGroupDelete(getDeletedTaxGroup.data));
      } else {
        return dispatch(taxGroupDeleteErr(getDeletedTaxGroup.data));
      }
    } catch (err) {
      dispatch(taxGroupDeleteErr(err));
    }
  };
};

export {
  getTaxGroupList,
  getAllTaxNameList,
  addOrUpdateTaxesGroup,
  getTaxGroupById,
  deleteTaxGroup,
};
